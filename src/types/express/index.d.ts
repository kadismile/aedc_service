import { StaffDoc } from './../staff.ts';
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      staff: StaffDoc;
    }
  }
}
