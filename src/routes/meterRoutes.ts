import express from 'express';

import {
  assignMeterToCustomer,
  assignMeterToStaff,
  createMeter,
  getByBarcode,
  getMeter,
  getMeterByVendor,
  getMeters,
  mapScan,
  updateMeter,
  uploadMetersCSV
} from '../controllers/meter_controller.js';
import { upload } from '../helpers/file_upload.js';
import { authorize, restrictToRoles } from '../middleware/permission-middleware.js';

const router = express.Router();

router.post('/', authorize, restrictToRoles(['admin']), createMeter);
router.get('/', authorize, getMeters);
router.get('/:id', authorize, getMeter);
router.get('/barcode/:barcode', authorize, getByBarcode);
router.get('/vendor/count', authorize, getMeterByVendor);
router.put('/update-meter/:id', authorize, upload.single('fileUpload'), updateMeter);
router.post('/assign/', authorize, upload.single('fileUpload'), assignMeterToStaff);
router.post('/map/scan', authorize, upload.single('fileUpload'), mapScan);
router.post('/customer/assign', authorize, upload.single('fileUpload'), assignMeterToCustomer);
router.post('/upload', authorize, upload.single('fileUpload'), uploadMetersCSV);

export default router;
