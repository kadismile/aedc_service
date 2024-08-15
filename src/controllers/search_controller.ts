import { Request, Response } from 'express';

import Logger from '../libs/logger.js';
import Customer from '../models/CustomerModel/CustomerModel.js';
import Meter from '../models/MeterModel/MeterModel.js';
import Staff from '../models/StaffModel/StaffModel.js';
import Vendor from '../models/VendorModel/VendorModel.js';
import { SearchRequest } from '../types/search.js';

export const search = async (req: Request, res: Response) => {
  const { model, searchText } = req.body as SearchRequest;

  if (!model || !searchText) {
    return res.status(400).json({
      status: 'failed',
      message: 'Model and searchText are required'
    });
  }

  try {
    let results;
    const regex = new RegExp(searchText, 'i');

    switch (model) {
      case 'meters':
        results = await Meter.find({
          $or: [{ meterNumber: regex }, { barcode: regex }]
        }).exec();
        break;
      case 'customers':
        results = await Customer.find({
          $or: [{ name: regex }, { phoneNumber: regex }]
        }).exec();
        break;
      case 'vendors':
        results = await Vendor.find({
          $or: [{ name: regex }, { phoneNumber: regex }]
        }).exec();
        break;
      case 'staffs':
        results = await Staff.find({
          $or: [{ name: regex }, { phoneNumber: regex }]
        }).exec();
        break;
      default:
        return res.status(400).json({
          status: 'failed',
          message: 'Invalid model specified'
        });
    }

    return res.status(200).json({
      status: 'success',
      data: results
    });
  } catch (error) {
    Logger.error(`Error searching ${model} with params ${searchText}: ${error}`);
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error'
    });
  }
};
