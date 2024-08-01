import { Request, Response } from 'express';
import NodeGeocoder from 'node-geocoder';

import { createCustomerApiValidator } from '../api_validators/customer-api-validator.js';
import { advancedResults } from '../helpers/query.js';
import Logger from '../libs/logger.js';
import Customer, { CustomerDocumentResult } from '../models/CustomerModel/CustomerModel.js';
import { CustomerDoc,RegisterCustomerRequestBody } from '../types/customer.js';


const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
  httpAdapter: 'https',
  formatter: null
});

export const createCustomer = async (req: Request, res: Response) => {
  const body = req.body as RegisterCustomerRequestBody;
  const { name, address, phoneNumber } = body;

  try {
    const { error } = createCustomerApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    // Get geocode information
    const [geoData] = await geocoder.geocode(address);
    if (!geoData) {
      return res.status(404).json({ message: 'Unable to geocode address' });
    }

    const { latitude, longitude } = geoData;

    const newCustomer = new Customer({
      name,
      address,
      phoneNumber,
      geocode: {
        latitude,
        longitude
      },
      createdBy: req.staff._id
    });

    await newCustomer.save();
    return res.status(201).json({
      status: 'success',
      message: 'Customer created successfully',
      data: newCustomer
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
      data: customers
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
        message: `Customer not found with id ${id}`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: customer
    });
  } catch (error) {
    Logger.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const body = req.body as RegisterCustomerRequestBody;
  const { name, address, phoneNumber } = body;
  const { id } = req.params;

  try {
    const { error } = createCustomerApiValidator.validate(req.body);
    if (error) {
      return res.status(422).json({ error: error.details[0].message });
    }

    const [geoData] = await geocoder.geocode(address);
    if (!geoData) {
      return res.status(404).json({ message: 'Unable to geocode address' });
    }

    const { latitude, longitude } = geoData;

    if (id) {
      await Customer.findByIdAndUpdate(
        { _id: id },
        { name, address, phoneNumber, geocode: { latitude, longitude } }
      );
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
