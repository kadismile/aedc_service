import express from 'express';

import {
  assignMeterToStaff,
  createMeter,
  getByBarcode,
  getMeter,
  getMeterByNumber,
  getMeterByVendor,
  getMeters,
  updateMeter
} from '../controllers/meter_controller.js';
import { upload } from '../helpers/file_upload.js';
import { authorize, restrictToRoles } from '../middleware/permission-middleware.js';

const router = express.Router();

router.post('/', authorize, restrictToRoles(['admin']), createMeter);
router.get('/', getMeters);
router.get('/:id', getMeter);
router.get('/barcode/:barcode', getByBarcode);
router.get('/vendor/count', getMeterByVendor);
router.put('/update-meter/:id', authorize, upload.single('fileUpload'), updateMeter);
router.post('/assign/', authorize, assignMeterToStaff);


export default router;
