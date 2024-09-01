import express from 'express';

import {
  createCustomer,
  getCustomer,
  getCustomers,
  getCustomersByState,
  notifyInstallationCompleted,
  notifyInstallationProgress,
  updateCustomer } from '../controllers/customer_controller.js';
import { authorize, restrictToRoles } from '../middleware/permission-middleware.js';

const router = express.Router();

router.get('/', authorize, getCustomers);
router.post('/', authorize, createCustomer);
router.get('/:id', authorize, restrictToRoles(['admin']), getCustomer);
router.put('/:id', authorize, restrictToRoles(['admin']), updateCustomer);
router.get('/state/count', getCustomersByState);
router.post('/:id/notify-progress', authorize, restrictToRoles(['admin']), notifyInstallationProgress);
router.post('/:id/notify-completion', authorize, restrictToRoles(['admin']), notifyInstallationCompleted);

export default router;
