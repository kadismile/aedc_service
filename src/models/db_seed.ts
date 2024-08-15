import { faker } from '@faker-js/faker';

import {
  generateRandomNumber,
  getAdminStaff,
  getMAPStaff,
  getRandomAEDCstate,
  getRandomCoordinate,
  getRandomMeterType,
  getRandomVendorId
} from '../helpers/application_helper.js';
import Logger from '../libs/logger.js';
import { METER_STATUS } from '../types/meter.js';
import Customer from './CustomerModel/CustomerModel.js';
import History from './HistoryModel/HistoryModel.js';
import Meter from './MeterModel/MeterModel.js';
import Staff from './StaffModel/StaffModel.js';
import Vendor from './VendorModel/VendorModel.js';

const staffSeedData = [
  {
    _id: '66056a0b8cddbeac52b7221f',
    email: process.env.DEFAULT_APP_EMAIL,
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07067775027',
    fullName: 'kadismile Ibrahim',
    role: 'admin',
    createdBy: '66056a0b8cddbeac52b7221f'
  },
  {
    _id: '65f343be0b30444e0835c411',
    email: 'blonde@gmail.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07066665027',
    fullName: 'blonde Chilaka',
    role: 'installer',
    createdBy: '66056a0b8cddbeac52b7221f'
  },

  {
    _id: '65f89585fd782e2be490ef3e',
    email: 'cleopatra@gmail.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07064555027',
    fullName: 'Cleopatra Odemwingie',
    role: 'installer',
    createdBy: '66056a0b8cddbeac52b7221f'
  },

  {
    _id: '66f89585fd782e2be530ef3e',
    email: 'philip@gmail.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07064234027',
    fullName: 'Philip  Anka',
    role: 'installer',
    createdBy: '66056a0b8cddbeac52b7221f'
  },

  {
    _id: '66f89235fd782e2be530ef3e',
    email: 'nehemiah@gmail.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07064111059',
    fullName: 'Nehimiah  Puininin',
    role: 'installer',
    createdBy: '66056a0b8cddbeac52b7221f'
  },
  {
    _id: '66ad35383d9ac5f396732d81',
    email: 'abdul@gmaill.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07064454059',
    fullName: 'Abdul  Ibrahim',
    role: 'installer',
    createdBy: '66056a0b8cddbeac52b7221f'
  },
  {
    _id: '66ad35393d9ac5f396732d8b',
    email: 'william@gmaill.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07064239058',
    fullName: 'William Goodwill',
    role: 'aedc_staff',
    createdBy: '66056a0b8cddbeac52b7221f'
  },

  {
    _id: '66ad353c3d9ac5f396732d9f',
    email: 'ikadismile@gmaill.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07064239214',
    fullName: 'Onogie Ibrahim',
    vendor: '66a8d7f078390e69e094e58d',
    role: 'meter_access_provider',
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

const createMeterData = async () => {
  const vendor = await getRandomVendorId();
  const createdBy = await getAdminStaff();
  const updatedBy = await getAdminStaff();
  const state = getRandomAEDCstate();
  const meterData = [
    {
      meterNumber: generateRandomNumber(11),
      barcode: generateRandomNumber(15),
      typeOfMeter: getRandomMeterType(),
      meterStatus: METER_STATUS.NEWMETER,
      vendor,
      address: {
        fullAddress: faker.location.secondaryAddress(),
        state,
        longitude: getRandomCoordinate(state).longitude,
        latitude: getRandomCoordinate(state).latitude
      },
      history: [{}],
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
      for (let i = 1; i <= 50; i++) {
        const myMeterData = await createMeterData();
        const meter = new Meter(myMeterData[0]);
        await meter.save();
        const staff = await getMAPStaff();
        const state = getRandomAEDCstate();
        const action = `a new meter as just been captured by ${staff.fullName}`;
        const history = new History({
          staff: staff._id,
          entityId: meter._id,
          entity: 'meter',
          action,
          address: {
            fullAddress: faker.location.secondaryAddress(),
            state,
            longitude: getRandomCoordinate(state).longitude,
            latitude: getRandomCoordinate(state).latitude
          }
        });
        await history.save();
        await Meter.findOneAndUpdate({ _id: meter.id }, { $push: { meterHistory: history._id } });
        Logger.info('Meter Data Seeded Succesfully ....');
      }
    }
  } catch (error) {
    Logger.error(error);
  }
};
