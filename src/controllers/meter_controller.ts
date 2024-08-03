import { Request, Response } from 'express';
import { Document } from 'mongoose';

import { createMeterApiValidator, updateMeterApiValidator } from '../api_validators/meter-api-validators.js';
import { advancedResults } from '../helpers/query.js';
import Logger from '../libs/logger.js';
import Meter, { MeterDocumentResult } from '../models/MeterModel/MeterModel.js';
import { MeterDoc, RegisterMeterRequestBody } from '../types/meter.js';

export const createMeter = async (req: Request, res: Response) => {
  const body = req.body as RegisterMeterRequestBody;
  const { meterNumber, typeOfMeter, vendor, meterStatus, barcode } = body;
  try {
    const { error } = createMeterApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    const createdBy = req.staff._id;

    const newMeter = new Meter({ meterNumber, typeOfMeter, vendor, createdBy, meterStatus, barcode });
    await newMeter.save();
    return res.status(201).json({
      status: 'success',
      message: 'Meter created successfully',
      data: newMeter
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMeter = async (req: Request, res: Response) => {
  const { meterStatus } = req.body as RegisterMeterRequestBody;
  const { id } = req.params;
  try {
    const { error } = updateMeterApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    const meter = await Meter.findOne({ _id: id });
    if (!meter) {
      return res.status(404).json({ message: 'Meter not found' });
    }
    await Meter.findByIdAndUpdate({ _id: id }, { meterStatus });
    return res.status(200).json({
      status: 'success'
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMeter = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const meter = await Meter.findOne<MeterDocumentResult>({ _id: id });
    if (!meter) {
      return res.status(404).json({
        status: 'failed',
        message: `Meter not found with id ${id}`
      });
    }
    return res.status(200).json({
      status: 'success',
      data: meter
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMeters = async (req: Request, res: Response) => {
  try {
    const meters = await advancedResults<MeterDoc, MeterDocumentResult & Document>(req.url, Meter);
    return res.status(200).json({
      status: 'success',
      data: meters
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getByBarcode = async (req: Request, res: Response) => {
  const { barcode } = req.params;
  try {
    const meter = await Meter.findOne<MeterDocumentResult>({ barcode });
    if (!meter) {
      return res.status(404).json({
        status: 'failed',
        message: `Meter not found with barcode ${barcode}`
      });
    }
    return res.status(200).json({
      status: 'success',
      data: meter
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMeterByVendor = async (req: Request, res: Response) => {
  try {
    const result = await Meter.aggregate([
      {
        $group: {
          _id: '$vendor', // Group by vendor ObjectId
          count: { $sum: 1 } // Count the number of meters for each vendor
        }
      },
      {
        $lookup: {
          from: 'vendors', // Name of the collection where vendor details are stored
          localField: '_id', // Field to join on (vendor ObjectId)
          foreignField: '_id', // Field in the vendors collection to match (vendor ObjectId)
          as: 'vendorDetails' // Name of the field to output
        }
      },
      {
        $unwind: '$vendorDetails' // Flatten the vendorDetails array
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          vendorID: '$_id', // Include vendorID
          vendorName: '$vendorDetails.name', // Include vendorName
          count: 1 // Include the count of meters
        }
      }
    ]);

    return res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMeterByNumber = async (req: Request, res: Response) => {
  const meterNumber = req.query['meter-number'] as string;

  if (!meterNumber || typeof meterNumber !== 'string') {
    return res.status(400).json({
      status: 'failed',
      message: 'Invalid or missing meter number query parameter'
    });
  }

  Logger.info(`Searching for meters with meter number: ${meterNumber}`);
  try {
    const regex = new RegExp(meterNumber, 'i'); 
    const meters = await Meter.find<MeterDocumentResult>({ meterNumber: regex });

    if (meters.length === 0) {
      Logger.warn(`No meters found with meter number containing: ${meterNumber}`);
      return res.status(404).json({
        status: 'failed',
        message: `No meters found with meter number containing: ${meterNumber}`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: meters
    });
  } catch (error) {
    Logger.error(`Error searching meters with number ${meterNumber}: ${error}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};