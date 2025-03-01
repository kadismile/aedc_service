import { Request, Response } from 'express';
import { Document } from 'mongoose';

import {
  changePasswordApiValidator,
  createStaffApiValidator,
  staffLoginApiValidator
} from '../api_validators/staff-api-validators.js';
import { advancedResults } from '../helpers/query.js';
import { sanitizeReturnedStaff } from '../helpers/staff_helper.js';
import Logger from '../libs/logger.js';
import Assignemnt from '../models/AssignmentModel/AssigmentModel.js';
import History from '../models/HistoryModel/HistoryModel.js';
import Meter from '../models/MeterModel/MeterModel.js';
import Staff, { StaffDocumentResult } from '../models/StaffModel/StaffModel.js';
import Vendor from '../models/VendorModel/VendorModel.js';
import { HistoryDoc } from '../types/history.js';
import { METER_STATUS } from '../types/meter.js';
import { RegisterStaffRequestBody, STAFF_ROLE, StaffDoc } from '../types/staff.js';

export const createStaff = async (req: Request, res: Response) => {
  const body = req.body as RegisterStaffRequestBody;
  const { email, vendor, phoneNumber, fullName, password, role, staffRegion } = body;
  const createdBy = req.staff._id;
  try {
    const { error } = createStaffApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    const newStaff = new Staff({
      email,
      vendor,
      phoneNumber,
      fullName,
      password,
      role,
      createdBy,
      staffRegion,
      permissions: []
    });
    await newStaff.save();
    return res.status(201).json({
      status: 'success',
      message: 'Staff registered successfully',
      data: newStaff
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginStaff = async (req: Request, res: Response) => {
  const body = req.body as RegisterStaffRequestBody;
  const { email, password } = body;
  try {
    const { error } = staffLoginApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    const staff = await Staff.findOneActive({ email });

    if (!staff) {
      return res.status(401).json({
        status: 'failed',
        message: 'invalid credentials'
      });
    }
    const isMatch = await staff.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'failed',
        message: 'invalid credentials'
      });
    }
    const token = staff.getSignedJwtToken();
    const returnedStaff = sanitizeReturnedStaff(staff._doc);
    return res.status(200).json({
      status: 'success',
      token,
      staff: { ...returnedStaff }
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const body = req.body as RegisterStaffRequestBody;
  const { oldPassword, newPassword } = body;
  try {
    const { error } = changePasswordApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    const staff = req.staff;
    const isMatch = await staff.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid current password provided'
      });
    }

    await Staff.findOneAndUpdate({ _id: staff._id }, { password: newPassword });

    return res.status(200).json({
      status: 'success',
      message: 'password changed successfully'
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStaffs = async (req: Request, res: Response) => {
  try {
    const staffs = await advancedResults<StaffDoc, StaffDocumentResult & Document>(req.url, Staff);
    await Staff.populate(staffs.results, { path: 'vendor', select: 'name -_id' });
    return res.status(200).json({
      status: 'success',
      data: staffs
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getStaff = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findOneActive({ _id: id });
    if (!staff) {
      return res.status(404).json({
        status: 'failed',
        message: `Staff not found with id ${id}`
      });
    }
    const returnedUser = sanitizeReturnedStaff(staff._doc);

    if (returnedUser.role === STAFF_ROLE.INSTALLER) {
      const assignedMeters = await Assignemnt.find({ staff: returnedUser._id });
      const assignmentIds = assignedMeters.map(ass => ass.meter);
      const installedMeters = await Meter.find({
        _id: { $in: assignmentIds },
        meterStatus: METER_STATUS.INSTALLED
      });
      return res.status(200).json({
        status: 'success',
        data: {
          ...returnedUser,
          installedMeters: installedMeters.length,
          assignedMeters: assignedMeters.length
        }
      });
    } else {
      return res.status(200).json({
        status: 'success',
        data: returnedUser
      });
    }
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const authorizeStaff = (req: Request, res: Response) => {
  try {
    const staff = req.staff;
    if (staff) {
      return res.status(200).json({
        status: 'success',
        staff
      });
    } else {
      return res.status(200).json({
        status: 'failed'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: 'internal server error'
    });
  }
};

export const getHistoryOfMeterScan = async (req: Request, res: Response) => {
  try {
    const histories = await advancedResults<HistoryDoc, StaffDocumentResult & Document>(req.url, History);
    return res.status(200).json({
      status: 'success',
      data: histories.results
    });
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: 'internal server error'
    });
  }
};

export const getStaffsByVendor = async (req: Request, res: Response) => {
  const { vendorId } = req.params;
  try {
    const vendor = await Vendor.findById(vendorId);
    await Staff.findByIdAndUpdate({ _id: '66ad35383d9ac5f396732d81' }, { vendor: '66056a0b8cddbeac52b7221f' });

    if (!vendor) {
      return res.status(404).json({
        status: 'failed',
        message: `No vendor found with vendorId ${vendorId}`
      });
    }
    const staffMembers = await Staff.find({ vendor: vendorId });
    return res.status(200).json({
      status: 'success',
      data: staffMembers
    });
  } catch (error) {
    console.error('Error fetching staff members by vendor:', error);
    throw error;
  }
};

export const deActivateStaff = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (id) {
      await Staff.findByIdAndUpdate({ _id: id }, { isActive: false });
      return res.status(200).json({
        status: 'success',
        message: 'Staff Deactivated Successfully'
      });
    } else {
      return res.status(422).json({ error: 'id is required' });
    }
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
