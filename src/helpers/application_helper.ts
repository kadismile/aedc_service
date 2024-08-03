import crypto from 'crypto';

import Meter from '../models/MeterModel/MeterModel.js';
import Staff from '../models/StaffModel/StaffModel.js';
import Vendor from '../models/VendorModel/VendorModel.js';
import { METER_TYPE } from '../types/meter.js';
import { STAFF_REGION, STAFF_ROLE } from '../types/staff.js';

export const formatCsvCell = (str: string) =>
  str
    // In case there is a quotation mark in the string already, it needs to be escaped too.
    // @see https://stackoverflow.com/a/44120055
    .replace(/"/g, '""')
    // Replace all white-space characters (including new line breaks) with a single space.
    // @see https://stackoverflow.com/a/45029224
    .replace(/\s+/g, ' ')
    .trim();

export const stringToBoolean = (str: string) => {
  return str === 'true';
};

export const generateRandomNumber = (len: number) => {
  const buffer = crypto.randomBytes(6);
  let randomNumberString = parseInt(buffer.toString('hex'), 16).toString();
  if (randomNumberString.length > len) {
    randomNumberString = randomNumberString.slice(0, 11);
  } else {
    while (randomNumberString.length < len) {
      randomNumberString += Math.floor(Math.random() * 10).toString();
    }
  }

  return randomNumberString;
};

export const getRandomMeterType = () => {
  const values = Object.values(METER_TYPE);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex] as METER_TYPE;
};

export const getRandomAEDCstate = () => {
  const values = Object.values(STAFF_REGION);
  const randomIndex = Math.floor(Math.random() * values.length);
  return values[randomIndex] as STAFF_REGION;
};

export const getRandomVendorId = async () => {
  const vendors = await Vendor.findActive({});
  const randomIndex = Math.floor(Math.random() * vendors.length);
  return vendors[randomIndex];
};

export const getAdminStaff = async () => {
  const staff = await Staff.findOne({ role: STAFF_ROLE.ADMIN });
  return staff._id;
};

export const getRandomMeterId = async () => {
  const meters = await Meter.find({});
  const randomIndex = Math.floor(Math.random() * meters.length);
  return meters[randomIndex];
};

export const stateBoundingBoxes = {
  Abuja: { latMin: 8.4, latMax: 9.2, lonMin: 7.3, lonMax: 7.8 },
  Nassarawa: { latMin: 8.5, latMax: 9.4, lonMin: 7.0, lonMax: 8.2 },
  Kogi: { latMin: 7.9, latMax: 8.8, lonMin: 6.7, lonMax: 8.0 },
  Niger: { latMin: 8.0, latMax: 10.0, lonMin: 5.5, lonMax: 7.5 }
};

export const getRandomCoordinate = (state: string) => {
  const box = stateBoundingBoxes[state];
  const lat = Math.random() * (box.latMax - box.latMin) + box.latMin;
  const lon = Math.random() * (box.lonMax - box.lonMin) + box.lonMin;
  return { latitude: lat, longitude: lon };
};
