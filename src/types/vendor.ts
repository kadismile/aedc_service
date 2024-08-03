import { Types } from 'mongoose';

import { AdvancedQueryResult } from './queryresults.js';

export type VendorDoc = {
  _id: Types.ObjectId;
  name: string;
  address: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export type AdvancedStaffsQueryResult = AdvancedQueryResult<VendorDoc>;

export type RegisterVendorRequestBody = Omit<VendorDoc, '_id' | 'createdAt' | 'updatedAt'>;
