import Logger from '../libs/logger.js';
import Customer from '../models/CustomerModel/CustomerModel.js';
import History from '../models/HistoryModel/HistoryModel.js';
import Meter from '../models/MeterModel/MeterModel.js';
import Vendor from '../models/VendorModel/VendorModel.js';
import { AddressDoc, CustomerDoc } from '../types/customer.js';
import { METER_STATUS, METER_TYPE, MeterDoc } from '../types/meter.js';
import { VendorDoc } from '../types/vendor.js';
import { STAFF_ROLE, StaffDoc } from './../types/staff.js';

type CsvData = {
  meterNumber: string;
  typeOfMeter: METER_TYPE;
  meterStatus: string;
  barcode: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  state: string;
  customerEmail: string;
};

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

export const validateCsvAndCreate = async (staff, meter: CsvData) => {
  try {
    const { meterNumber, typeOfMeter, barcode, customerName, phoneNumber, customerEmail, address, state } = meter;

    if (
      !meterNumber ||
      !typeOfMeter ||
      !barcode ||
      !customerName ||
      !phoneNumber ||
      !customerEmail ||
      !address ||
      !state
    ) {
      return { error: 'incomplete CSV data' };
    }
    const findMeter = await Promise.all([
      await Meter.findOne({ $or: [{ meterNumber: meter.meterNumber, barcode: meter.barcode }] })
    ]);
    if (!findMeter.includes(null)) {
      return { error: `This Meter Already Exists with meter-number ${meter.meterNumber}` };
    } else {
      const { meterNumber, typeOfMeter, barcode, customerName, phoneNumber, customerEmail, address, state } = meter;

      const addressDoc = {
        fullAddress: address,
        state,
        longitude: '9.0563',
        latitude: '7.4985'
      };

      const customer = new Customer({
        name: customerName,
        email: customerEmail,
        address: addressDoc,
        phoneNumber
      });

      await customer.save();

      const newMeter = new Meter({
        meterNumber,
        typeOfMeter,
        vendor: staff.vendor,
        createdBy: staff._id,
        meterStatus: METER_STATUS.NEWMETER,
        barcode
      });
      await newMeter.save();

      const assignmentData = {
        customerId: customer._id,
        meterId: newMeter._id,
        address
      };
      return await assignMeterToCustomer(assignmentData, staff);
    }
  } catch (error) {
    return { error: `Error Uploading CSV ${error}` };
  }
};

const assignMeterToCustomer = async (data, staff: StaffDoc) => {
  //if (staff.role == STAFF_ROLE.AEDC_STAFF) {
  const { customerId, meterId, address } = data;
  try {
    const meter = await Meter.findOne({ _id: meterId, meterStatus: METER_STATUS.NEWMETER });
    if (!meter) {
      return { error: `No Meter Found` };
    }

    const customer = await Customer.findOne({ _id: customerId });
    if (!customer) {
      return { error: 'customer not found' };
    }

    const updateMeter = await Meter.findByIdAndUpdate(
      { _id: meter._id },
      { meterStatus: METER_STATUS.ASSIGNED, address, customer: customer._id },
      { new: true }
    );

    const vendor = await Vendor.findOne({ _id: staff.vendor });
    await generateMeterHistory(updateMeter, staff, vendor, address, undefined, customer);
    return;
  } catch (error) {
    Logger.error(error);
    return 'Internal server error';
  }
  // } else {
  //   return { error: 'you cannot perfoem this operation' };
  // }
};
