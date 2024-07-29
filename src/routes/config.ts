import { Router } from 'express';

import indexRouter from './index.js';
import vendorRouter from './VendorRoutes.js';

export type RouteConfig = {
  route: string;
  router: Router;
};

export const routerConfig: RouteConfig[] = [
  { route: '/', router: indexRouter },
  { route: '/vendors', router: vendorRouter },

  
];
