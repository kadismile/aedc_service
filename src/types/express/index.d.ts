import { StaffDoc } from './../staff/staff.js';
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      staff: StaffDoc;
    }
  }
}
