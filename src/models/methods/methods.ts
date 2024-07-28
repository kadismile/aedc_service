import { FilterQuery, Model } from 'mongoose';

export const DEFAULT_POPULATE_OPTIONS = { path: 'createdBy updatedBy', select: 'fullName -_id' };


export type BaseDocument<T> = {
  _doc: T;
};


export type BaseModelMethods<T> = {
  findActive: (query: FilterQuery<T>) => Promise<T[]>;
  findOneActive: (query: FilterQuery<T>) => Promise<T>;
};

export type BaseModelPopulatedMethods<T> = {
  findAndPopulate: (query: FilterQuery<T>) => Promise<T[]>;
  findAllActiveAndPopulate: (query: FilterQuery<T>) => Promise<T[]>;
};

export const findActive = function <T>(this: Model<T>, query: FilterQuery<T>) {
  return this.find({ ...query, isActive: true });
};

export const findOneActive = function <T>(this: Model<T>, query: FilterQuery<T>) {
  return this.findOne({ ...query, isActive: true });
};

export const findAndPopulate = function <T>(this: Model<T>, query: FilterQuery<T>) {
  return this.find({ ...query }).populate(populateFields(this));
};

export const findAllActiveAndPopulate = function <T>(this: Model<T>, query: FilterQuery<T>) {
  return this.find({ ...query, isActive: true }).populate(populateFields(this));
};

export const populateFields = <T>(model: Model<T>) => {
  const populateOptions: Record<string, Array<{ path: string; select: string }>> = {
    Staff: [{ path: 'createdBy', select: 'fullName -_id' }],

  };

  const modelName = model.modelName;
  return populateOptions[modelName] || [{ path: 'createdBy', select: 'fullName -_id' }];
};
