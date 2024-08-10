import { Request, Response } from 'express';

import Logger from '../libs/logger.js';
import Customer from '../models/CustomerModel/CustomerModel.js';
import Meter from '../models/MeterModel/MeterModel.js';
import Vendor from '../models/VendorModel/VendorModel.js';
import { SearchRequest } from '../types/search.js';

export const search = async (req: Request, res: Response) => {
  const { model, searchParams } = req.body as SearchRequest;

  if (!model || !searchParams) {
    return res.status(400).json({
      status: 'failed',
      message: 'Model and searchParams are required'
    });
  }

  try {
    let results;
    const regex = new RegExp(searchParams, 'i');
    const query = {
      $or: [{ meterNumber: regex }, { barcode: regex }, { name: regex }, { phoneNumber: regex }]
    };

    switch (model) {
      case 'meters':
        results = await Meter.find(query).exec();
        break;
      case 'customers':
        results = await Customer.find(query).exec();
        break;
      case 'vendors':
        results = await Vendor.find(query).exec();
        break;
      default:
        return res.status(400).json({
          status: 'failed',
          message: 'Invalid model specified'
        });
    }

    if (results?.length === 0) {
      return res.status(404).json({
        status: 'failed',
        message: `No results found for model: ${model} with searchParams: ${searchParams}`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: results
    });
  } catch (error) {
    Logger.error(`Error searching ${model} with params ${searchParams}: ${error}`);
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error'
    });
  }
};
