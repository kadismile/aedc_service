import express from 'express';

import { search } from '../controllers/search_controller.js';
import { authorize, restrictToRoles } from '../middleware/permission-middleware.js';

const router = express.Router();

router.post('/search-resource', authorize, restrictToRoles(['admin']), search);

export default router;

