import { Router } from 'express';

import { createVendor, getVendorById, updateVendor } from '../controllers/vendor_controller.js';

const router = Router();

router.get('/:id', getVendorById);
router.post('/', createVendor);
router.put('/:id', updateVendor);

export default router;
