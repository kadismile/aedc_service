import { Types } from 'mongoose';

import { AdvancedQueryResult } from './queryresults.js';

export type HistoryDoc = {
  _id: Types.ObjectId;
  staff: Types.ObjectId;
  entityId: Types.ObjectId;
  entity: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdvancedHistoryQueryResult = AdvancedQueryResult<HistoryDoc>;

export type RegisterVendorRequestBody = Omit<HistoryDoc, '_id' | 'createdAt' | 'updatedAt'>;
