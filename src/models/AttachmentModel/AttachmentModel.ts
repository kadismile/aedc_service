import mongoose, { Model } from 'mongoose';

import { AttachmentDoc } from '../../types/attachment.js';
import {
  BaseModelMethods,
  findActive,
  findAllActiveAndPopulate,
  findAndPopulate,
  findOneActive
} from '../methods/methods.js';

type BaseDocument<T> = {
  _doc: T;
};

export type AttachmentDocumentResult = AttachmentDoc & BaseDocument<AttachmentDoc>;

type AttachmentModel = BaseModelMethods<AttachmentDocumentResult> & Model<AttachmentDoc>;

const attachmentSchema = new mongoose.Schema<AttachmentDocumentResult, AttachmentModel>(
  {
    action: {
      type: String,
      required: true
    },
    asset_id: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },
    signature: {
      type: String,
      required: true
    },
    format: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    secure_url: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

attachmentSchema.static('findOneActive', findOneActive);
attachmentSchema.static('findActive', findActive);
attachmentSchema.static('findAndPopulate', findAndPopulate);
attachmentSchema.static('findAllActiveAndPopulate', findAllActiveAndPopulate);

const Attachment = mongoose.model<AttachmentDocumentResult, AttachmentModel>('Attachment', attachmentSchema);
export default Attachment;
