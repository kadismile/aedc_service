import { Router } from 'express';

import authRouter from './authRoutes.js';
import customerRouter from './customerRoutes.js';
import departmentRouter from './departmentRoutes.js';
import indexRouter from './index.js';
import meterRouter from './meterRoutes.js';
import searchRouter from './searchRoutes.js';
import staffRouter from './staffRoutes.js';
import vendorRouter from './vendorRoutes.js';

export type RouteConfig = {
  route: string;
  router: Router;
};

export const routerConfig: RouteConfig[] = [
  { route: '/', router: indexRouter },
  { route: '/auth', router: authRouter },
  { route: '/staff', router: staffRouter },
  { route: '/department', router: departmentRouter },
  { route: '/meter', router: meterRouter },
  { route: '/vendor', router: vendorRouter },
  { route: '/customer', router: customerRouter },
  { route: '/search', router: searchRouter }
];