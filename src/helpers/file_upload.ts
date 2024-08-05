import { Agenda } from 'agenda';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import Logger from '../libs/logger.js';
import Attachment from '../models/AttachmentModel/AttachmentModel.js';
import Meter from '../models/MeterModel/MeterModel.js';
import { MeterDoc } from './../types/meter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type JobDoc = {
  fileName: string;
  filePath: string;
  data: MeterDoc;
  model: string;
};

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, path.join(__dirname));
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, `${Date.now()}-${fileName}`);
  }
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/gif' ||
      file.mimetype == 'video/mp4' ||
      file.mimetype == 'video/webm' ||
      file.mimetype == 'video/ogg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error('file format not allowed!'));
    }
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const manageFileUpload = async (filePath, fileName, data, model) => {
  try {
    const mongoConnectionString = process.env.MONGO_URL;
    if (!mongoConnectionString) {
      throw new Error('MONGO_URL is not defined');
    }

    const agenda = new Agenda({
      db: { address: mongoConnectionString, collection: 'jobCollection' }
    });

    agenda.define('Upload Images', async job => {
      const { filePath, fileName, data, model } = job.attrs.data as JobDoc;
      await uploadToCloudinary({ filePath, fileName, data, model });
    });

    await agenda.start();

    await agenda.schedule('in 20 seconds', 'Upload Images', {
      filePath,
      fileName,
      data,
      model
    });

    Logger.info('Agenda started and job scheduled');
  } catch (error) {
    console.error('Error:', error);
  }
};

const uploadToCloudinary = async job => {
  const { fileName, filePath, data, model } = job as JobDoc;
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: fileName,
      resource_type: 'auto'
    });

    const { asset_id, public_id, signature, format, url, secure_url } = result;

    const attachment = new Attachment({
      asset_id,
      public_id,
      signature,
      format,
      url,
      secure_url,
      model
    });
    await attachment.save();

    await Meter.findByIdAndUpdate({ _id: data._id }, { $push: { attachments: attachment._id } }, { new: true });

    fs.unlinkSync(filePath);
  } catch (error) {
    console.error('Error processing job:', error);
  }
};
