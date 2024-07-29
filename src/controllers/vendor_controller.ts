/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import Vendor from '../models/VendorModel/VendorModel.js';

export const getVendorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid Vendor ID');
    }
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).send('Vendor not found');
    }
    res.send(vendor);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

export const createVendor = async (req: Request, res: Response) => {
  try {
    const vendorData = req.body;
    const newVendor = new Vendor({
      ...vendorData,
      _id: new mongoose.Types.ObjectId(), 
    });
    await newVendor.save();
    res.status(201).send(newVendor);
  } catch (error) {
    res.status(400).send('Error creating vendor');
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid Vendor ID');
    }
    const updateData = req.body;
    const updatedVendor = await Vendor.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedVendor) {
      return res.status(404).send('Vendor not found');
    }
    res.send(updatedVendor);
  } catch (error) {
    res.status(400).send('Error updating vendor');
  }
};
