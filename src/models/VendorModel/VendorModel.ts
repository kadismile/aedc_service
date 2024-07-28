import mongoose, { Model } from 'mongoose';
import {
  BaseModelMethods,
  findActive,
  findAllActiveAndPopulate,
  findAndPopulate,
  findOneActive
} from '../methods/methods.js';
import { VendorDoc } from '../../types/vendor/vendor.js';

type BaseDocument<T> = {
  _doc: T;
};

export type VendorDocumentResult = VendorDoc & BaseDocument<VendorDoc>;

type VendorModel = BaseModelMethods<VendorDocumentResult> & Model<VendorDoc>;

const vendorSchema = new mongoose.Schema<VendorDocumentResult, VendorModel>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true, // Automatically manage ObjectId
    },
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
