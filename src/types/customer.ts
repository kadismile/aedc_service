import { Types } from 'mongoose';



export type CustomerDoc = {
  _id: Types.ObjectId;
  name: string;
  address: string;
  phoneNumber: string;
  geocode: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export type AdvancedStaffsQueryResult = AdvancedQueryResult<CustomerDoc>;

export type RegisterCustomerRequestBody = Omit<CustomerDoc, '_id' | 'createdAt' | 'updatedAt'>;





import { Document, Types } from 'mongoose';

export type CustomerDoc = Document & {
  _id: Types.ObjectId;
  name: string;
  address: string;
  phoneNumber: string;
  geocode: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};

export type AdvancedStaffsQueryResult = AdvancedQueryResult<CustomerDoc>;

export type RegisterCustomerRequestBody = Omit<CustomerDoc, '_id' | 'createdAt' | 'updatedAt'>;
