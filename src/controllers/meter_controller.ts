import CSVToJSON from 'csvtojson';
import { Request, Response } from 'express';
import fs from 'fs';
import { Document } from 'mongoose';

import {
  assignMeterApiValidator,
  assignMeterToCustomerApiValidator,
  createMeterApiValidator,
  updateMeterApiValidator
} from '../api_validators/meter-api-validators.js';
import { manageFileUpload } from '../helpers/file_upload.js';
import { generateMeterHistory, meterUpdateStaffCheck, validateCsvAndCreate } from '../helpers/meter_helper.js';
import { advancedResults } from '../helpers/query.js';
import Logger from '../libs/logger.js';
import Assignemnt from '../models/AssignmentModel/AssigmentModel.js';
import Customer from '../models/CustomerModel/CustomerModel.js';
import Meter, { MeterDocumentResult } from '../models/MeterModel/MeterModel.js';
import Staff from '../models/StaffModel/StaffModel.js';
import Vendor from '../models/VendorModel/VendorModel.js';
import { AddressDoc } from '../types/customer.js';
import { METER_STATUS, MeterDoc, RegisterMeterRequestBody } from '../types/meter.js';
import { STAFF_ROLE } from '../types/staff.js';
import { validateMeterStatus } from './../helpers/meter_helper.js';

export const createMeter = async (req: Request, res: Response) => {
  const body = req.body as RegisterMeterRequestBody;
  const { meterNumber, typeOfMeter, vendor, meterStatus, barcode } = body;
  try {
    const { error } = createMeterApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    const createdBy = req.staff._id;
    const newDept = new Meter({ meterNumber, typeOfMeter, vendor, createdBy, meterStatus, barcode });
    await newDept.save();
    return res.status(201).json({
      status: 'success',
      message: 'Meter created successfully',
      data: newDept
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMeter = async (req: Request, res: Response) => {
  const body = req.body as RegisterMeterRequestBody;
  const { meterStatus, address } = body;
  const { id } = req.params;
  try {
    const { error } = updateMeterApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    const staffCheck = meterUpdateStaffCheck(meterStatus, req.staff.role);
    if (!staffCheck) {
      return res
        .status(422)
        .json({ error: `You do not have the permissions to perform this operation as a ${req.staff.role}` });
    }

    const meter = await Meter.findOne({ _id: id });
    if (!meter) {
      return res.status(404).json({ message: 'meter not found' });
    }
    if (id) {
      if (validateMeterStatus(meter, meterStatus)) {
        const message = validateMeterStatus(meter, meterStatus);
        return res.status(422).json({ error: message });
      }

      if (req?.file) {
        const { path, filename } = req.file;
        await manageFileUpload(path, filename, meter, 'meters');
      }

      const updateMeter = await Meter.findByIdAndUpdate({ _id: id }, { meterStatus, address }, { new: true });
      const vendor = await Vendor.findOne({ _id: req.staff.vendor });
      if (req.staff.role == STAFF_ROLE.AEDC_STAFF || vendor?._id.equals(req.staff.vendor)) {
        await generateMeterHistory(updateMeter, req.staff, vendor, address, undefined);
      } else {
        return res.status(422).json({ error: 'you cannot update meter for another vendor' });
      }

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

export const getMeter = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const meter = await Meter.findById(id)
      .populate({
        path: 'meterHistory',
        select: 'action staff customer address -_id',
        populate: {
          path: 'staff',
          select: 'fullName phoneNumber -_id'
        }
      })
      .populate('customer', 'address name -_id')
      .populate('vendor', 'address name -_id')
      .populate('attachments', 'secure_url -_id');

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
    await Meter.populate(meters.results, { path: 'customer', select: 'name address phoneNumber -_id' });
    await Meter.populate(meters.results, { path: 'vendor', select: 'name -_id' });
    await Meter.populate(meters.results, { path: 'attachments', select: 'secure_url -_id' });
    await Meter.populate(meters.results, {
      path: 'meterHistory',
      select: 'action staff customer address -_id',
      populate: {
        path: 'staff',
        select: 'fullName phoneNumber -_id'
      }
    });

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
    const meter = await Meter.findOne<MeterDocumentResult>({ barcode: barcode })
      .populate({
        path: 'meterHistory',
        select: 'action staff customer address -_id',
        populate: {
          path: 'staff',
          select: 'fullName phoneNumber -_id'
        }
      })
      .populate('customer', 'address name -_id')
      .populate('vendor', 'address name -_id')
      .populate('attachments', 'secure_url -_id');
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
          _id: '$vendor',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendorDetails'
        }
      },
      {
        $unwind: '$vendorDetails'
      },
      {
        $project: {
          _id: 0,
          vendorID: '$_id',
          vendorName: '$vendorDetails.name',
          count: 1
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

export const assignMeterToStaff = async (req: Request, res: Response) => {
  const body = req.body as { staffId: string; meterId: string; address: AddressDoc };
  const staff = req.staff;

  if (staff.role == STAFF_ROLE.MAP) {
    const { staffId, meterId, address } = body;
    try {
      const { error } = assignMeterApiValidator.validate(req.body);
      if (error) {
        return res.status(422).json({ error: error.details[0].message });
      }

      const meter = await Meter.findOne({ _id: meterId, meterStatus: METER_STATUS.ASSIGNED }); // this meter would have been assigned to a customer
      if (!meter) {
        return res.status(404).json({ message: 'meter not found' });
      }

      const assigned = await Assignemnt.findOne({ meter: meterId, staff: staffId });
      if (assigned) {
        return res.status(422).json({ error: 'meter has already been assigned to this installer' });
      }

      if (!req.staff.vendor.equals(meter.vendor)) {
        return res.status(422).json({ message: 'you can only assign meters within your vendor' });
      }

      if (req?.file) {
        const { path, filename } = req.file;
        await manageFileUpload(path, filename, meter, 'meters');
      }

      const staff = await Staff.findOne({ _id: staffId, role: STAFF_ROLE.INSTALLER });
      if (!staff) {
        return res.status(404).json({ message: 'staff not found' });
      }
      const assignment = new Assignemnt({
        staff: staffId,
        meter: meterId,
        createdBy: req.staff._id
      });
      await assignment.save();

      const updatedMeter = await Meter.findByIdAndUpdate(
        { _id: meter._id },
        { address, staff: staffId },
        { new: true }
      );

      const vendor = await Vendor.findOne({ _id: req.staff.vendor });
      await generateMeterHistory(updatedMeter, req.staff, vendor, address, staff);

      return res.status(200).json({
        status: 'success',
        message: `meter successfully assigned to ${staff.fullName}`
      });
    } catch (error) {
      Logger.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(422).json({ error: 'you must be a meter access provider to perfoem this operation' });
  }
};

export const mapScan = async (req: Request, res: Response) => {
  const body = req.body as RegisterMeterRequestBody;
  const { meterStatus, address, meterNumber, barcode, typeOfMeter } = body;
  try {
    const { error } = createMeterApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    const staffCheck = meterUpdateStaffCheck(meterStatus, req.staff.role);
    if (!staffCheck) {
      return res
        .status(422)
        .json({ error: `You do not have the permissions to perform this operation as a ${req.staff.role}` });
    }

    const meter = await Meter.findOne({ meterNumber });
    if (meter) {
      return res.status(422).json({ error: `this meter as already been scanned as a new meter` });
    } else {
      const newMeter = new Meter({
        meterNumber,
        barcode,
        meterStatus,
        typeOfMeter,
        vendor: req.staff.vendor,
        address,
        createdBy: req.staff._id
      });
      await newMeter.save();

      if (req?.file) {
        const { path, filename } = req.file;
        await manageFileUpload(path, filename, newMeter, 'meters');
      }

      const vendor = await Vendor.findOne({ vendor: req.staff.vendor });
      await generateMeterHistory(newMeter, req.staff, vendor, address, undefined);

      return res.status(201).json({
        status: 'success',
        message: 'Meter created successfully',
        data: newMeter
      });
    }
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const assignMeterToCustomer = async (req: Request, res: Response) => {
  const body = req.body as { customerId: string; meterId: string; address: AddressDoc };
  const staff = req.staff;

  if (staff.role == STAFF_ROLE.AEDC_STAFF) {
    const { customerId, meterId, address } = body;
    try {
      const { error } = assignMeterToCustomerApiValidator.validate(req.body);
      if (error) {
        return res.status(422).json({ error: error.details[0].message });
      }

      const meter = await Meter.findOne({ _id: meterId, meterStatus: METER_STATUS.NEWMETER }); // this meter must be a new meter
      if (!meter) {
        return res.status(404).json({ message: 'meter not found' });
      }

      const customer = await Customer.findOne({ _id: customerId });
      if (!customer) {
        return res.status(404).json({ message: 'customer not found' });
      }

      const updateMeter = await Meter.findByIdAndUpdate(
        { _id: meter._id },
        { meterStatus: METER_STATUS.ASSIGNED, address, customer: customer._id },
        { new: true }
      );

      const vendor = await Vendor.findOne({ _id: req.staff.vendor });
      // the address here is the aedc address
      await generateMeterHistory(updateMeter, req.staff, vendor, address, undefined, customer);

      return res.status(200).json({
        status: 'success',
        message: `meter successfully assigned to ${customer.name}`
      });
    } catch (error) {
      Logger.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(422).json({ error: 'you must be an aedc staff to perfoem this operation' });
  }
};

export const uploadMetersCSV = async (req: Request, res: Response) => {
  try {
    if (req.staff.role == STAFF_ROLE.AEDC_STAFF) {
      res.status(403).json({
        status: 'failed',
        data: [{ error: 'youre not permitted to perform this operation' }]
      });
    }
    if (req?.file) {
      const { path } = req.file;
      const mapCSV = await CSVToJSON().fromFile(path);
      const errors = [];
      for (const mapData of mapCSV) {
        const staff = req.staff;
        const validation = await validateCsvAndCreate(staff, mapData);
        if (validation) {
          errors.push(validation);
        }
      }
      fs.unlinkSync(path);
      if (errors.length) {
        res.status(403).json({
          status: 'failed',
          data: errors
        });
      } else {
        res.status(201).json({
          status: 'success',
          data: 'product successfully uploaded via csv'
        });
      }
    }
  } catch (e) {
    res.status(403).json({
      error: e,
      status: 'failed',
      message: e.message
    });
  }
};
