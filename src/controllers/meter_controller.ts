import { Request, Response } from 'express';
import { Document } from 'mongoose';

import { createMeterApiValidator, updateMeterApiValidator } from '../api_validators/meter-api-validators.js';
import { manageFileUpload } from '../helpers/file_upload.js';
import { generateMeterHistory, meterUpdateStaffCheck } from '../helpers/meter_helper.js';
import { advancedResults } from '../helpers/query.js';
import Logger from '../libs/logger.js';
import Meter, { MeterDocumentResult } from '../models/MeterModel/MeterModel.js';
import { MeterDoc, RegisterMeterRequestBody } from '../types/meter.js';
import { validateMeterStatus } from './../helpers/meter_helper.js';

export const createMeter = async (req: Request, res: Response) => {
  const body = req.body as RegisterMeterRequestBody;
  const { meterNumber, typeOfMeter, vendor, meterStatus, barcode } = body;
  try {
    const { error } = createMeterApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    const createdBy = req.staff._id;
    const newDept = new Meter({ meterNumber, typeOfMeter, vendor, createdBy, meterStatus, barcode });
    await newDept.save();
    return res.status(201).json({
      status: 'success',
      message: 'Meter created successfully',
      data: newDept
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMeter = async (req: Request, res: Response) => {
  const body = req.body as RegisterMeterRequestBody;
  const { meterStatus } = body;
  const { id } = req.params;
  try {
    const { error } = updateMeterApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    const staffCheck = meterUpdateStaffCheck(meterStatus, req.staff.role);
    if (!staffCheck) {
      return res
        .status(422)
        .json({ error: `You do not have the permissions to perform this operation as a ${req.staff.role}` });
    }

    const meter = await Meter.findOne({ _id: id });
    if (!meter) {
      return res.status(404).json({ message: 'meter not found' });
    }
    if (id) {
      if (validateMeterStatus(meter, meterStatus)) {
        const message = validateMeterStatus(meter, meterStatus);
        return res.status(422).json({ error: message });
      }
      const updateMeter = await Meter.findByIdAndUpdate({ _id: id }, { meterStatus }, { new: true });

      if (req?.file) {
        const { path, filename } = req.file;
        await manageFileUpload(path, filename, updateMeter, 'meters');
      }

      generateMeterHistory(updateMeter, req.staff);

      return res.status(200).json({
        status: 'success'
      });
    } else {
      return res.status(422).json({ error: 'id is required' });
    }
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMeter = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const meter = await Meter.findById(id)
      .populate('meterHistory', 'action staff customer -_id')
      .populate('customer', 'address name -_id')
      .populate('vendor', 'address name -_id')
      .populate('attachments', 'secure_url -_id');
    if (!meter) {
      return res.status(404).json({
        status: 'failed',
        message: `Meter not found with id ${id}`
      });
    }
    return res.status(200).json({
      status: 'success',
      data: meter
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMeters = async (req: Request, res: Response) => {
  try {
    const staffs = await advancedResults<MeterDoc, MeterDocumentResult & Document>(req.url, Meter);
    return res.status(200).json({
      status: 'success',
      data: staffs
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getByBarcode = async (req: Request, res: Response) => {
  const { barcode } = req.params;
  try {
    const meter = await Meter.findOne<MeterDocumentResult>({ barcode: barcode })
      .populate('meterHistory', 'action staff -_id')
      .populate('customer', 'address name -_id')
      .populate('vendor', 'address name -_id')
      .populate('attachments', 'secure_url -_id');
    if (!meter) {
      return res.status(404).json({
        status: 'failed',
        message: `Meter not found with barcode ${barcode}`
      });
    }
    return res.status(200).json({
      status: 'success',
      data: meter
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMeterByVendor = async (req: Request, res: Response) => {
  try {
    const result = await Meter.aggregate([
      {
        $group: {
          _id: '$vendor',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendorDetails'
        }
      },
      {
        $unwind: '$vendorDetails'
      },
      {
        $project: {
          _id: 0,
          vendorID: '$_id',
          vendorName: '$vendorDetails.name',
          count: 1
        }
      }
    ]);

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMeterByNumber = async (req: Request, res: Response) => {
  const meterNumber = req.query['meter-number'] as string;

  if (!meterNumber || typeof meterNumber !== 'string') {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid or missing meter number query parameter'
    });
  }

  Logger.info(`Searching for meters with meter number: ${meterNumber}`);
  try {
    const regex = new RegExp(meterNumber, 'i');
    const meters = await Meter.find<MeterDocumentResult>({ meterNumber: regex });

    if (meters.length === 0) {
      Logger.warn(`No meters found with meter number containing: ${meterNumber}`);
      return res.status(404).json({
        status: 'failed',
        message: `No meters found with meter number containing: ${meterNumber}`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: meters
    });
  } catch (error) {
    Logger.error(`Error searching meters with number ${meterNumber}: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};