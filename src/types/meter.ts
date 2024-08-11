import { Types } from 'mongoose';

import { AddressDoc } from './customer.js';
import { AdvancedQueryResult } from './queryresults.js';

export enum METER_TYPE {
  SINGLE_METER = 'single phase meter',
  THREE_PHASE_METER = 'three phase meter',
  TWO_PHASE_METER = 'two phase meter',
  FEEDER_METER = 'feeder meter'
}

export enum METER_STATUS {
  NEWMETER = 'new_meter', //
  INSTALLED = 'installed',
  ASSIGNED = 'assigned',
  COMMISIONED = 'commisioned'
}

export type MeterDoc = {
  _id: Types.ObjectId;
  id: string;
  address: AddressDoc;
  meterNumber: string;
  barcode: string;
  meterStatus: METER_STATUS;
  typeOfMeter: METER_TYPE;
  meterHistory: Types.ObjectId[];
  customer?: Types.ObjectId;
  attachments?: Types.ObjectId[];
  vendor: Types.ObjectId;
  staff: Types.ObjectId;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type AdvancedMeterQueryResult = AdvancedQueryResult<MeterDoc>;

export type RegisterMeterRequestBody = Omit<MeterDoc, '_id' | 'createdAt' | 'updatedAt'>;
