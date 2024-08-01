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
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      fullAddress: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true,
        enum: ['Abuja', 'Nassarawa', 'Kogi']
      },
      longitude: {
        type: Number,
        required: true
      },
      latitude: {
        type: Number,
        required: true
      },
      geocode: {
        type: String,
        required: true
      }
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
