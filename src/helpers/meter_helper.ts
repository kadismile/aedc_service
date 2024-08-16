import Logger from '../libs/logger.js';
import Customer from '../models/CustomerModel/CustomerModel.js';
import History from '../models/HistoryModel/HistoryModel.js';
import Meter from '../models/MeterModel/MeterModel.js';
import { AddressDoc, CustomerDoc } from '../types/customer.js';
import { METER_STATUS, MeterDoc } from '../types/meter.js';
import { VendorDoc } from '../types/vendor.js';
import { STAFF_ROLE, StaffDoc } from './../types/staff.js';

export const generateMeterHistory = async (
  meter: MeterDoc,
  staff: StaffDoc,
  vendor: VendorDoc,
  address: AddressDoc,
  staffInstaller: StaffDoc,
  meterCustomer?: CustomerDoc
) => {
  try {
    const customer = await Customer.findOne({ _id: meter.customer });

    const createHistoryAndUpdateMeter = async (action: string) => {
      try {
        const history = new History({
          staff: staff._id,
          entityId: meter._id,
          entity: 'meter',
          customer: customer._id,
          action,
          address
        });
        await history.save();
        await Meter.findOneAndUpdate({ _id: meter.id }, { $push: { meterHistory: history._id } });
        return;
      } catch (error) {
        Logger.info(error);
      }
    };

    if (meter.meterStatus === METER_STATUS.ASSIGNED && !staffInstaller) {
      const action = `A new meter has just been assigned to customer, ${meterCustomer.name} in ${customer.address.fullAddress}`;
      await createHistoryAndUpdateMeter(action);
      //  TODO: send SMS here to customer and mail too telling them about there new meter coming
      return;
    }

    if (meter.meterStatus === METER_STATUS.INSTALLED) {
      const action = `A new meter has just been installed in ${customer.address.fullAddress} by ${staff.fullName} of ${vendor.name}`;
      await createHistoryAndUpdateMeter(action);
      return;
    }

    if (meter.meterStatus === METER_STATUS.COMMISIONED) {
      const action = `meter has just been commisioned in ${customer.address.fullAddress} by ${staff.fullName}`;
      await createHistoryAndUpdateMeter(action);
      return;
    }

    if (meter.meterStatus === METER_STATUS.NEWMETER) {
      const action = `a new meter has just been captured by ${staff.fullName}`;
      await createHistoryAndUpdateMeter(action);
      return;
    }

    if (staffInstaller) {
      const action = `A new meter has just been assigned for installation to ${staffInstaller.fullName} at ${address.fullAddress}`;
      await createHistoryAndUpdateMeter(action);
      return;
    }
  } catch (error) {
    return 'An Error has Occured in creating history and updating a meter';
  }
};

export const validateMeterStatus = (meter: MeterDoc, meterStatus: METER_STATUS) => {
  let message: string;

  if (meterStatus == meter.meterStatus) {
    message = `this meter action "${meterStatus}" has already been done`;
  }

  if (meterStatus == METER_STATUS.COMMISIONED && meter.meterStatus == METER_STATUS.ASSIGNED) {
    message = `this meter cannot be ${meterStatus} at this moment, it needs to be installed`;
  }

  if (meterStatus == METER_STATUS.ASSIGNED && meter.meterStatus == METER_STATUS.INSTALLED) {
    message = `this meter can no longer be ${meterStatus} it has already been installed`;
  }

  if (meterStatus == METER_STATUS.ASSIGNED && !meter.customer) {
    message = `this meter cannot be verified at this moment it needed to be assigned to a customer`;
  }

  if (message) {
    return message;
  }
  return undefined;
};

export const meterUpdateStaffCheck = (meterStatus, role) => {
  if (role == STAFF_ROLE.AEDC_STAFF) {
    return true;
  }

  if (meterStatus == METER_STATUS.COMMISIONED && role == STAFF_ROLE.AEDC_STAFF) {
    return true;
  }

  if (meterStatus == METER_STATUS.INSTALLED && role == STAFF_ROLE.INSTALLER) {
    return true;
  }

  if (meterStatus == METER_STATUS.NEWMETER && role == STAFF_ROLE.MAP) {
    return true;
  }

  return undefined;
};
