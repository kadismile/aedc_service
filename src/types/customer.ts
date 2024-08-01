import { Document, Types } from 'mongoose';

export type CustomerDoc = {
  _id: Types.ObjectId;
  name: string;
  phoneNumber: string;
  address: {
    fullAddress: string;
    state: string;
    longitude: number;
    latitude: number;
    geocode?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
} & Document

export type RegisterCustomerRequestBody = Omit<CustomerDoc, '_id' | 'createdAt' | 'updatedAt'>;
