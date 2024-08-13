import Customer from '../models/CustomerModel/CustomerModel.js';
import History from '../models/HistoryModel/HistoryModel.js';
import Meter from '../models/MeterModel/MeterModel.js';
import { AddressDoc } from '../types/customer.js';
import { METER_STATUS, MeterDoc } from '../types/meter.js';
import { VendorDoc } from '../types/vendor.js';
import { STAFF_ROLE, StaffDoc } from './../types/staff.js';

export const generateMeterHistory = async (
  meter: MeterDoc,
  staff: StaffDoc,
  vendor: VendorDoc,
  address: AddressDoc,
  staffInstaller: StaffDoc
) => {
  try {
    const customer = await Customer.findOne({ _id: meter.customer });

    const createHistoryAndUpdateMeter = async (action: string) => {
      const history = new History({
        staff: staff._id,
        entityId: meter._id,
        entity: 'meter',
        customer,
        action,
        address
      });
      await history.save();

      await Meter.findByIdAndUpdate({ _id: meter._id }, { $push: { meterHistory: history._id } });
      return;
    };

    if (meter.meterStatus === METER_STATUS.ASSIGNED && !staffInstaller) {
      const action = `A new meter as just been assigned to ${customer.name}`;
      await createHistoryAndUpdateMeter(action);
      //  TODO: send SMS here to customer and mail too telling them about there new meter coming
      return;
    }

    if (meter.meterStatus === METER_STATUS.INSTALLED) {
      const action = `A new meter as just been installed in ${customer.address.fullAddress} by ${staff.fullName} of ${vendor.name}`;
      await createHistoryAndUpdateMeter(action);
      return;
    }

    if (meter.meterStatus === METER_STATUS.COMMISIONED) {
      const action = `meter as just been commisioned in ${customer.address.fullAddress} by ${staff.fullName}`;
      await createHistoryAndUpdateMeter(action);
      return;
    }

    if (meter.meterStatus === METER_STATUS.NEWMETER) {
      const action = `a new meter as just been captured by ${staff.fullName}`;
      await createHistoryAndUpdateMeter(action);
      return;
    }

    if (staffInstaller) {
      const action = `A new meter as just been assigned for installation to ${staffInstaller.fullName}`;
      await createHistoryAndUpdateMeter(action);
      return;
    }
  } catch (error) {
    return 'An Error as Occured in creating history and updating a meter';
  }
};

export const validateMeterStatus = (meter: MeterDoc, meterStatus: METER_STATUS) => {
  let message: string;

  if (meterStatus == meter.meterStatus) {
    message = `this meter action "${meterStatus}" as already been done`;
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
  /* if (role == STAFF_ROLE.ADMIN) {
    return true;
  } */

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
