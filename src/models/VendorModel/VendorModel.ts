import mongoose, { Model } from 'mongoose';

import { VendorDoc } from '../../types/vendor.js';
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

export type VendorDocumentResult = VendorDoc & BaseDocument<VendorDoc>;

type VendorModel = BaseModelMethods<VendorDocumentResult> & Model<VendorDoc>;

const vendorSchema = new mongoose.Schema<VendorDocumentResult, VendorModel>(
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
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

vendorSchema.static('findOneActive', findOneActive);
vendorSchema.static('findActive', findActive);
vendorSchema.static('findAndPopulate', findAndPopulate);
vendorSchema.static('findAllActiveAndPopulate', findAllActiveAndPopulate);

const Vendor = mongoose.model<VendorDocumentResult, VendorModel>('Vendor', vendorSchema);
export default Vendor;
