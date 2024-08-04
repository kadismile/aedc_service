import mongoose, { Model, Schema } from 'mongoose';

import { HistoryDoc } from '../../types/history.js';
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

export type HistoryDocumentResult = HistoryDoc & BaseDocument<HistoryDoc>;

type HistoryModel = BaseModelMethods<HistoryDocumentResult> & Model<HistoryDoc>;

const historySchema = new mongoose.Schema<HistoryDocumentResult, HistoryModel>(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
      required: true
    },
    entityId: {
      type: Schema.Types.ObjectId,
      ref: 'Meter'
    },
    entity: {
      type: String
    },
    action: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

historySchema.static('findOneActive', findOneActive);
historySchema.static('findActive', findActive);
historySchema.static('findAndPopulate', findAndPopulate);
historySchema.static('findAllActiveAndPopulate', findAllActiveAndPopulate);

const History = mongoose.model<HistoryDocumentResult, HistoryModel>('History', historySchema);
export default History;
