import cors from 'cors';
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { RouteConfig, routerConfig } from './routes/config.js';

const app = express();
app.use(express.json());
app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
app.use(express.urlencoded({ extended: true }));

//swagger implementation
const domainUrl = process.env.DOMAIN_URL || '';
const domain = domainUrl.split('//');
const options = {
  openapi: '3.0.0',
  definition: {
    info: {
      version: 'v1.0.0',
      title: 'Ware House Manager APIs',
      description: 'This lists and describes the Ware House Manager api endpoints'
    },
    host: `${domain[1]}`,
    basePath: '/',
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Enter the token with the `Bearer: ` prefix, e.g. "Bearer eyJhbGci".',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    schemes: ['http', 'https']
  },
  apis: ['./src/api_schemas/*.ts']
};
const swaggerDocs = swaggerJSDoc(options);
//Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

routerConfig.forEach(({ route, router }: RouteConfig) => {
  app.use(route, router);
});

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Header', 'Origin, X-Requested-with, Content-Type, Accept, Authorization');
  next();
});

app.use((req, res) => res.status(404).json());

export default app;
