import { Types } from 'mongoose';

import { AddressDoc } from './customer.js';
import { AdvancedQueryResult } from './queryresults.js';

export type HistoryDoc = {
  _id: Types.ObjectId;
  staff: Types.ObjectId;
  entityId: Types.ObjectId;
  customer: Types.ObjectId;
  entity: string;
  address: AddressDoc;
  action: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdvancedHistoryQueryResult = AdvancedQueryResult<HistoryDoc>;

export type RegisterVendorRequestBody = Omit<HistoryDoc, '_id' | 'createdAt' | 'updatedAt'>;
