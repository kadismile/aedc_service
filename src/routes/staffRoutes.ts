import express from 'express';

import { getHistoryOfMeterScan, getStaff, getStaffs, getStaffsByVendor } from '../controllers/staff_controller.js';
import { authorize, restrictToRoles } from '../middleware/permission-middleware.js';

const router = express.Router();

router.get('/all', authorize, restrictToRoles(['admin']), getStaffs);
router.get('/:id', authorize, restrictToRoles(['admin']), getStaff);
router.get('/meter/history', authorize, getHistoryOfMeterScan);
router.get('/vendor/:vendorId', authorize, getStaffsByVendor);

export default router;
