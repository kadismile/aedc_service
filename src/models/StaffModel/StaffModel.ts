import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Model, Schema, UpdateQuery } from 'mongoose';

import { STAFF_REGION, STAFF_ROLE, StaffDoc } from '../../types/staff.js';
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

export type StaffDocumentResult = StaffDoc & BaseDocument<StaffDoc>;

type StaffModel = BaseModelMethods<StaffDocumentResult> & Model<StaffDoc>;

const staffSchema = new mongoose.Schema<StaffDocumentResult, StaffModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    fullName: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    nickName: {
      type: String,
      unique: true,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: STAFF_ROLE
    },
    permissions: [
      {
        type: String,
        required: [true, 'Please Add permissions']
      }
    ],
    staffRegion: {
      type: String,
      enum: STAFF_REGION
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
      required: true
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

staffSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
    }
  }
  next();
});

staffSchema.pre('findOneAndUpdate', async function () {
  const update: UpdateQuery<StaffDocumentResult> = this.getUpdate();
  if (update.password && typeof update.password === 'string') {
    update.password = await bcrypt.hash(update.password, await bcrypt.genSalt(10));
  }
});

staffSchema.methods.matchPassword = async function (this: StaffDoc, enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};
staffSchema.methods.getSignedJwtToken = function (this: StaffDoc) {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ email: this.email, role: this.role, password: this.password }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

staffSchema.static('findOneActive', findOneActive);
staffSchema.static('findActive', findActive);
staffSchema.static('findAndPopulate', findAndPopulate);
staffSchema.static('findAllActiveAndPopulate', findAllActiveAndPopulate);

const Staff = mongoose.model<StaffDocumentResult, StaffModel>('Staff', staffSchema);
export default Staff;
