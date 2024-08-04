import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

import {
  generateRandomNumber,
  getAdminStaff,
  getRandomAEDCstate,
  getRandomCoordinate,
  getRandomMeterType,
  getRandomVendorId
} from '../helpers/application_helper.js';
import Logger from '../libs/logger.js';
import { METER_STATUS } from '../types/meter.js';
import Customer from './CustomerModel/CustomerModel.js';
import Meter from './MeterModel/MeterModel.js';
import Staff from './StaffModel/StaffModel.js';
import Vendor from './VendorModel/VendorModel.js';

type MapCustomerDoc = {
  _id: Types.ObjectId;
  number: number;
};

const staffSeedData = [
  {
    _id: '66056a0b8cddbeac52b7221f',
    email: process.env.DEFAULT_APP_EMAIL,
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07067775027',
    nickName: 'kadi',
    fullName: 'kadismile Ibrahim',
    role: 'admin',
    createdBy: '66056a0b8cddbeac52b7221f'
  },
  {
    _id: '65f343be0b30444e0835c499',
    email: 'blonde@gmail.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07066665027',
    nickName: 'blond',
    fullName: 'blonde Chilaka',
    role: 'installer',
    createdBy: '66056a0b8cddbeac52b7221f'
  },

  {
    _id: '65f89585fd782e2be490ef3e',
    email: 'cleopatra@gmal.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07064555027',
    nickName: 'Cleopatra',
    fullName: 'Cleopatra Odemwingie',
    role: 'installer',
    createdBy: '66056a0b8cddbeac52b7221f'
  }
];

const vendorSeedData = [
  {
    _id: '66056a0b8cddbeac52b7221f',
    name: 'mojek',
    address: 'lagos',
    // eslint-disable-next-line @typescript-eslint/unbound-method
    phoneNumber: String(faker.phone.number()),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    _id: '66a8d7f078390e69e094e58d',
    name: 'Protek',
    address: 'lagos',
    // eslint-disable-next-line @typescript-eslint/unbound-method
    phoneNumber: String(faker.phone.number()),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    _id: '6660b3720593c09feb54e2ad',
    name: 'Raise Synergy',
    address: 'lagos',
    // eslint-disable-next-line @typescript-eslint/unbound-method
    phoneNumber: String(faker.phone.number()),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    _id: '65f343be0b30444e0835c499',
    name: 'Momas Technologies',
    address: 'lagos',
    // eslint-disable-next-line @typescript-eslint/unbound-method
    phoneNumber: String(faker.phone.number()),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    _id: '66a76e74dc8b7d88b6a43516',
    name: 'Vendr Manufacturing',
    address: 'Abuja',
    // eslint-disable-next-line @typescript-eslint/unbound-method
    phoneNumber: String(faker.phone.number()),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  }
];

const createMeterData = async (customerId: ObjectId) => {
  const vendor = await getRandomVendorId();
  const createdBy = await getAdminStaff();
  const updatedBy = await getAdminStaff();

  const meterData = [
    {
      meterNumber: generateRandomNumber(11),
      barcode: generateRandomNumber(15),
      typeOfMeter: getRandomMeterType(),
      customer: customerId,
      meterStatus: METER_STATUS.ASSIGNED,
      vendor,
      createdBy,
      updatedBy
    }
  ];

  return meterData;
};

const createCustomerData = async () => {
  const createdBy = await getAdminStaff();
  const updatedBy = await getAdminStaff();
  const state = getRandomAEDCstate();

  const meterData = [
    {
      name: faker.internet.userName(),
      phoneNumber: String(faker.phone.number()),
      address: {
        fullAddress: faker.location.secondaryAddress(),
        state,
        longitude: getRandomCoordinate(state).longitude,
        latitude: getRandomCoordinate(state).latitude
      },
      createdBy,
      updatedBy
    }
  ];
  return meterData;
};

export const seedDBdata = async () => {
  try {
    const staffCount = await Staff.countDocuments();
    const vendorCount = await Vendor.countDocuments();
    const meterCount = await Meter.countDocuments();
    const customerCount = await Customer.countDocuments();

    if (staffCount < 1) {
      await Staff.create(staffSeedData);
      Logger.info('Staff Data Seeded Succesfully ....');
    }

    if (vendorCount < 1) {
      await Vendor.create(vendorSeedData);
      Logger.info('Vendor Data Seeded Succesfully ....');
    }

    if (customerCount < 1) {
      for (let i = 1; i <= 1000; i++) {
        await Customer.create(await createCustomerData());
        Logger.info('Customer Data Seeded Succesfully ....');
      }
    }

    if (meterCount < 1) {
      const customers = await Customer.find().limit(1500);
      const customerMap = customers.map((customer, index): MapCustomerDoc => {
        return {
          _id: customer._id,
          number: index
        };
      });

      for (let i = 1; i <= 1000; i++) {
        const customerToUpdate = customerMap.find(cus => i == cus.number);
        const meter = await Meter.create(await createMeterData(customerToUpdate._id));
        await Customer.findByIdAndUpdate({ _id: customerToUpdate._id }, { meterNumber: meter[0].meterNumber });
        Logger.info('Meter Data Seeded Succesfully ....');
      }
    }
  } catch (error) {
    Logger.error(error);
  }
};
