import mongoose, { Model, Schema } from 'mongoose';

import { METER_STATUS, METER_TYPE, MeterDoc } from '../../types/meter.js';
import { addressSchema } from '../CustomerModel/CustomerModel.js';
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

export type MeterDocumentResult = MeterDoc & BaseDocument<MeterDoc>;

type MeterModel = BaseModelMethods<MeterDocumentResult> & Model<MeterDoc>;

const meterSchema = new mongoose.Schema<MeterDocumentResult, MeterModel>(
  {
    meterNumber: {
      type: String,
      required: true,
      unique: true
    },
    barcode: {
      type: String,
      required: true,
      unique: true
    },
    meterStatus: {
      type: String,
      enum: METER_STATUS
    },
    typeOfMeter: {
      type: String,
      enum: METER_TYPE,
      required: [true, 'Please Add Meter type']
    },
    meterHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'History'
      }
    ],
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer'
    },
    address: {
      type: addressSchema,
      required: true
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Please Add Vendor']
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Attachment'
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Staff'
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Staff'
    }
  },
  {
    timestamps: true
  }
);

meterSchema.static('findOneActive', findOneActive);
meterSchema.static('findActive', findActive);
meterSchema.static('findAndPopulate', findAndPopulate);
meterSchema.static('findAllActiveAndPopulate', findAllActiveAndPopulate);

const Meter = mongoose.model<MeterDocumentResult, MeterModel>('Meter', meterSchema);
export default Meter;
