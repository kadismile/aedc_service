import { METER_STATUS } from '../types/meter.js';

type CustomerDoc = {
  name: string;
  address: {
    fullAddress: string;
    longitude: string;
    latitude: string;
  };
};

export const generateMeterHistory = (meterStatus: METER_STATUS, customer: CustomerDoc) => {
  // change customer type to the real customerDoc

  if (meterStatus === METER_STATUS.ASSIGNED) {
    return `A new meter as just been assigned to ${customer.name}`;
  }

  if (meterStatus === METER_STATUS.INSTALLED) {
    return `A new meter as just been installed in ${customer.address.fullAddress + 'for ' + customer.name} `;
  }

  if (meterStatus === METER_STATUS.VERIFIED) {
    return `meter as just been verified in ${customer.address.fullAddress} `;
  }
};
