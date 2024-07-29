import Logger from '../libs/logger.js';
import Staff from './StaffModel/StaffModel.js';
import Vendor from './VendorModel/VendorModel.js';
import mongoose from 'mongoose';

const userSeedData = [
  {
    _id: new mongoose.Types.ObjectId('66056a0b8cddbeac52b7221f'),
    email: process.env.DEFAULT_APP_EMAIL,
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07067775027',
    nickName: 'kadi',
    fullName: 'kadismile Ibrahim',
    role: 'admin',
    createdBy: new mongoose.Types.ObjectId('66056a0b8cddbeac52b7221f')
  },
  {
    _id: new mongoose.Types.ObjectId('65f343be0b30444e0835c499'),
    email: 'blonde@gmail.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07066665027',
    nickName: 'blond',
    fullName: 'blonde Chilaka',
    role: 'installer',
    createdBy: new mongoose.Types.ObjectId('66056a0b8cddbeac52b7221f')
  },
  {
    _id: new mongoose.Types.ObjectId('65f89585fd782e2be490ef3e'),
    email: 'cleopatra@gmal.com',
    password: process.env.DEFAULT_APP_PASSWORD,
    phoneNumber: '07064555027',
    nickName: 'Cleopatra',
    fullName: 'Cleopatra Odemwingie',
    role: 'installer',
    createdBy: new mongoose.Types.ObjectId('66056a0b8cddbeac52b7221f')
  }
];

const vendorSeedData = [
  {
    _id: new mongoose.Types.ObjectId('66056a0b8cddbeac52b72210'),
    name: 'Vendor One',
    address: '123 Vendor St.',
    phoneNumber: '08012345678'
  },
  {
    _id: new mongoose.Types.ObjectId('66056a0b8cddbeac52b72211'),
    name: 'Vendor Two',
    address: '456 Vendor Ave.',
    phoneNumber: '08087654321'
  }
];

export const seedDBdata = async () => {
  try {
    const staffCount = await Staff.countDocuments();
    if (staffCount < 1) {
      await Staff.create(userSeedData);
      Logger.info('Staff Data Seeded Successfully ....');
    }

    const vendorCount = await Vendor.countDocuments();
    if (vendorCount < 1) {
      await Vendor.create(vendorSeedData);
      Logger.info('Vendor Data Seeded Successfully ....');
    }
  } catch (error) {
    Logger.error(error);
  }
};
