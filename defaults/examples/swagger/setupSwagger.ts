import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { type Router } from 'express';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import swaggerUi from 'swagger-ui-express';
import { OpenApiAdapter } from './OpenApiAdapter';

export function setupSwagger(app: Router) {
  const theme = new SwaggerTheme();

  const generator = new OpenApiGeneratorV31(OpenApiAdapter.registry.definitions);
  const document = generator.generateDocument({
    openapi: '3.1.0',
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Servidor local v1',
      }
    ],
    info: {
      title: process.env.APPLICATION_NAME || 'API',
      version: '1.0.0',
      description: 'Documentação da API',
      contact: {
        // email: 'mathec@live.com',
        // name: 'Matheus Correa',
        // url: 'https://github.com/mathec-x'
      },
    },
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(document, {
    explorer: true,
    customSiteTitle: 'API Docs',
    customCss: '.swagger-ui .topbar { display: none }' + theme.getBuffer(SwaggerThemeNameEnum.DRACULA)
  }));

  app.get('/docs.json', (_req: any, res: any) => {
    res.json(document);
  });

  return document;
}