import express from 'express';

import {
  createMeter,
  getByBarcode,
  getMeter,
  getMeterByNumber,
  getMeterByVendor,
  getMeters,
  updateMeter } from '../controllers/meter_controller.js';
import { authorize, restrictToRoles } from '../middleware/permission-middleware.js';

const router = express.Router();

router.post('/', authorize, restrictToRoles(['admin']), createMeter);
router.get('/', getMeters);
router.get('/:id', getMeter);
router.get('/barcode/:barcode', getByBarcode);
router.get('/vendor/count', getMeterByVendor);
router.get('/search-meter-number/:search-meter-number', getMeterByNumber);
router.put('/update-meter/:id', authorize, updateMeter);

export default router;
