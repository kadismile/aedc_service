import { Request, Response } from 'express';
import { Document } from 'mongoose';

import { createCustomerApiValidator } from '../api_validators/customer-api-validator.js';
import { advancedResults } from '../helpers/query.js';
import Logger from '../libs/logger.js';
import Customer, { CustomerDocumentResult } from '../models/CustomerModel/CustomerModel.js';
import { CustomerDoc, RegisterCustomerRequestBody } from '../types/customer.js';

export const createCustomer = async (req: Request, res: Response) => {
  const body = req.body as RegisterCustomerRequestBody;
  try {
    const { error, value } = createCustomerApiValidator.validate(body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    const newCustomer = new Customer({
      name: value.name,
      phoneNumber: value.phoneNumber,
      address: value.address,
      createdBy: req.staff._id,
    });

    await newCustomer.save();
    return res.status(201).json({
      status: 'success',
      message: 'Customer created successfully',
      data: newCustomer,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await advancedResults<CustomerDoc, CustomerDocumentResult & Document>(req.url, Customer);
    return res.status(200).json({
      status: 'success',
      data: customers,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findOne<CustomerDocumentResult>({ _id: id });
    if (!customer) {
      return res.status(404).json({
        status: 'failed',
        message: `Customer not found with id ${id}`,
      });
    }

    return res.status(200).json({
      status: 'success',
      data: customer,
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const body = req.body as RegisterCustomerRequestBody;
  const { id } = req.params;
  try {
    const { error, value } = createCustomerApiValidator.validate(body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    if (id) {
      await Customer.findByIdAndUpdate(id, {
        name: value.name,
        phoneNumber: value.phoneNumber,
        address: value.address,
      });

      return res.status(200).json({
        status: 'success',
        message: 'Customer updated successfully',
      });
    } else {
      return res.status(422).json({ error: 'id is required' });
    }
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
