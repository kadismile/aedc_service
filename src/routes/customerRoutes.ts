import express from 'express';

import { createCustomer, getCustomer, getCustomers, updateCustomer } from '../controllers/customer_controller.js';
import { authorize, restrictToRoles } from '../middleware/permission-middleware.js';

const router = express.Router();

router.get('/', authorize, restrictToRoles(['admin']), getCustomers);
router.post('/', authorize, restrictToRoles(['admin']), createCustomer);
router.get('/:id', authorize, restrictToRoles(['admin']), getCustomer);
router.put('/:id', authorize, restrictToRoles(['admin']), updateCustomer);

export default router;
