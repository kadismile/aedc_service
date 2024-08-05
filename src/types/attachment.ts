import { Types } from 'mongoose';

import { AdvancedQueryResult } from './queryresults.js';

export type AttachmentDoc = {
  _id: Types.ObjectId;
  asset_id: string;
  public_id: string;
  signature: string;
  format: string;
  url: string;
  secure_url: string;
  model: string;
  createdAt: Date;
  createdBy: Types.ObjectId;
  updatedAt: Date;
};

export type AdvancedAttachmentQueryResult = AdvancedQueryResult<AttachmentDoc>;

export type RegisterAttachmentRequestBody = Omit<AttachmentDoc, '_id' | 'createdAt' | 'updatedAt'>;
