import { Types } from 'mongoose';

import { AdvancedQueryResult } from './queryresults.js';
import { STAFF_REGION } from './staff.js';

export type AddressDoc = {
  fullAddress: string;
  state: STAFF_REGION;
  type?: string;
  longitude: number;
  latitude: number;
  /*   plusCode6Hex?: string;
  plusCode?: string; */
};

export type CustomerDoc = {
  _id: Types.ObjectId;
  name: string;
  meterNumber: string;
  phoneNumber: string;
  address: AddressDoc;
  createdAt: Date;
  updatedAt: Date;
};

export type AdvancedCustomerQueryResult = AdvancedQueryResult<CustomerDoc>;

export type RegisterCustomerRequestBody = Omit<CustomerDoc, '_id' | 'createdAt' | 'updatedAt'>;