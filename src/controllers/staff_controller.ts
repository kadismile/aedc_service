import { Request, Response } from 'express';
import { Document } from 'mongoose';

import {
  changePasswordApiValidator,
  createStaffApiValidator,
  staffLoginApiValidator
} from '../api_validators/staff-api-validators.js';
import { advancedResults } from '../helpers/query.js';
import { passwordGenerator, sanitizeReturnedStaff } from '../helpers/staff_helper.js';
import Logger from '../libs/logger.js';
import History from '../models/HistoryModel/HistoryModel.js';
import Staff, { StaffDocumentResult } from '../models/StaffModel/StaffModel.js';
import { HistoryDoc } from '../types/history.js';
import { RegisterStaffRequestBody, StaffDoc } from '../types/staff.js';

export const createStaff = async (req: Request, res: Response) => {
  const body = req.body as RegisterStaffRequestBody;
  const { email, phoneNumber, nickName, fullName, role, staffRegion } = body;
  const createdBy = req.staff._id;
  const password = passwordGenerator();
  try {
    const { error } = createStaffApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }
    const newStaff = new Staff({
      email,
      password,
      phoneNumber,
      nickName,
      fullName,
      role,
      createdBy,
      staffRegion,
      permissions: []
    });
    await newStaff.save();
    newStaff.password = password;
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
    const staff = await Staff.findOne<StaffDocumentResult>({ _id: id });
    if (!staff) {
      return res.status(404).json({
        status: 'failed',
        message: `User not found with id ${id}`
      });
    }
    const returnedUser = sanitizeReturnedStaff(staff._doc);
    return res.status(200).json({
      status: 'success',
      data: returnedUser
    });
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

export const getHistoryofMeterScan = async (req: Request, res: Response) => {
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
