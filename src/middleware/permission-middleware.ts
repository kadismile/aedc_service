import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import Staff from '../models/StaffModel/StaffModel.js';
import { STAFF_ROLE } from '../types/staff.js';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).json({
      status: 'failed',
      error: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; password: string } | string;
    if (typeof decoded === 'string') {
      throw new Error('Invalid token');
    }

    const staff = await Staff.findOne({ email: decoded.email });

    if (!staff || staff.password !== decoded.password) {
      return res.status(401).json({
        status: 'failed',
        error: 'User not authorized to access this route'
      });
    }

    req.staff = staff;

    next();
  } catch (error) {
    next(new Error('Something went wrong!'));
    return res.status(403).json({
      status: 'false',
      message: `invalid signature`
    });
  }
};

export const restrictToRoles = (permitedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.staff?.role;
    if ((role && role === STAFF_ROLE.ADMIN) || permitedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).json({
        status: 'failed',
        error: 'No permissions to access this route'
      });
    }
  } catch (error) {
    next(new Error('Something went wrong!'));
  }
};
