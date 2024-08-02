import { Request, Response } from 'express';
import { Document } from 'mongoose';

import { createVendorApiValidator } from '../api_validators/vendor-api-validator.js';
import { advancedResults } from '../helpers/query.js';
import Logger from '../libs/logger.js';
import Vendor, { VendorDocumentResult } from '../models/VendorModel/VendorModel.js';
import { RegisterVendorRequestBody,VendorDoc } from '../types/vendor.js';





export const createVendor = async (req: Request, res: Response) => {
  const body = req.body as RegisterVendorRequestBody;
  const { name, address, phoneNumber } = body;
  try {
    const { error } = createVendorApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    const newVendor = new Vendor({ 
      name,
      address,
      phoneNumber,
      createdBy: req.staff._id

    });
    await newVendor.save();
    return res.status(201).json({
      status: 'success',
      message: 'Vendor created successfully',
      data: newVendor
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// get all vendor
export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await advancedResults<VendorDoc, VendorDocumentResult & Document>(req.url, Vendor);
    return res.status(200).json({
      status: 'success',
      data: vendors
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Get single vendor by ID
export const getVendor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findOne<VendorDocumentResult>({ _id: id });
    if (!vendor) {
      return res.status(404).json({
        status: 'failed',
        message: `Department not found with id ${id}`
      });
    }
  
    return res.status(200).json({
      status: 'success',
      data: vendor
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update vendor
export const updateVendor = async (req: Request, res: Response) => {
  const body = req.body as RegisterVendorRequestBody;
  const { name, address, phoneNumber } = body;
  const { id } = req.params;
  try {
    const { error } = createVendorApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    if (id) {
      await Vendor.findByIdAndUpdate({ _id: id }, { name, address, phoneNumber });
      return res.status(200).json({
        status: 'success'
      });
    } else {
      return res.status(422).json({ error: 'id is required' });
    }
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
  