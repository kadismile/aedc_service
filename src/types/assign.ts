import { Types } from 'mongoose';

import { AdvancedQueryResult } from './queryresults.js';

export type AssignmentDoc = {
  _id: Types.ObjectId;
  staff: Types.ObjectId;
  meter: Types.ObjectId;
  accepted: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type AdvancedAssignmentQueryResult = AdvancedQueryResult<AssignmentDoc>;

export type RegisterAssignmentRequestBody = Omit<AssignmentDoc, '_id' | 'createdAt' | 'updatedAt'>;
