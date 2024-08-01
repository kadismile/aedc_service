import mongoose, { Model } from 'mongoose';

import { CustomerDoc } from '../../types/customer.js';
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

export type CustomerDocumentResult = CustomerDoc & BaseDocument<CustomerDoc>;

type CustomerModel = BaseModelMethods<CustomerDocumentResult> & Model<CustomerDoc>;

const customerSchema = new mongoose.Schema<CustomerDocumentResult, CustomerModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    geocode: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    isActive: {
      type: Boolean,
      default: true
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
