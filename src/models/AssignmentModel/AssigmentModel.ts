import mongoose, { Model, Schema } from 'mongoose';

import { AssignmentDoc } from '../../types/assign.js';
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

export type AssignmentDocumentResult = AssignmentDoc & BaseDocument<AssignmentDoc>;

type AssignmentModel = BaseModelMethods<AssignmentDocumentResult> & Model<AssignmentDoc>;

const assignmentSchema = new mongoose.Schema<AssignmentDocumentResult, AssignmentModel>(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
      required: true
    },
    meter: {
      type: Schema.Types.ObjectId,
      ref: 'Meter',
      required: true
    },
    accepted: {
      type: Boolean,
      required: true,
      default: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Meter',
      required: true
    }
  },
  {
    timestamps: true
  }
);

assignmentSchema.static('findOneActive', findOneActive);
assignmentSchema.static('findActive', findActive);
assignmentSchema.static('findAndPopulate', findAndPopulate);
assignmentSchema.static('findAllActiveAndPopulate', findAllActiveAndPopulate);

const Assignemnt = mongoose.model<AssignmentDocumentResult, AssignmentModel>('Assignemnt', assignmentSchema);
export default Assignemnt;
