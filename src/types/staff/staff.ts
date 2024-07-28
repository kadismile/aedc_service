import { Types } from 'mongoose';
import { AdvancedQueryResult } from '../queryresults.js';

export enum STAFF_ROLE {
  ADMIN = 'admin',
  INSTALLER = 'installer',
}

export type StaffDoc = {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
  nickName: string;
  fullName: string;
  phoneNumber: string;
  role: STAFF_ROLE;
  createdBy: Types.ObjectId;
  department: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  matchPassword?: (enteredPassword: string) => Promise<boolean>;
  getSignedJwtToken?: () => string;
  oldPassword?: string;
  newPassword?: string;
};

export type SanitizedStaffDoc = Omit<StaffDoc, 'password'>

export type AdvancedStaffsQueryResult = AdvancedQueryResult<SanitizedStaffDoc>