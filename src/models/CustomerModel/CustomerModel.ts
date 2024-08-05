import mongoose, { Model } from 'mongoose';

import { AddressDoc, CustomerDoc } from '../../types/customer.js';
import { STAFF_REGION } from '../../types/staff.js';
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

const addressSchema = new mongoose.Schema<AddressDoc>({
  fullAddress: { type: String, required: true },
  state: { type: String, enum: Object.values(STAFF_REGION), required: true },
  type: { type: String },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true }
});

export type CustomerDocumentResult = CustomerDoc & BaseDocument<CustomerDoc>;

type CustomerModel = BaseModelMethods<CustomerDocumentResult> & Model<CustomerDoc>;

const customerSchema = new mongoose.Schema<CustomerDocumentResult, CustomerModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: addressSchema,
      required: true
    },
    meterNumber: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

customerSchema.static('findOneActive', findOneActive);
customerSchema.static('findActive', findActive);
customerSchema.static('findAndPopulate', findAndPopulate);
customerSchema.static('findAllActiveAndPopulate', findAllActiveAndPopulate);

const Customer = mongoose.model<CustomerDocumentResult, CustomerModel>('Customer', customerSchema);
export default Customer;