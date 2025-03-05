import 'reflect-metadata';
import express from 'express';
import { orm } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { vehiculoRouter } from './components/vehiculo/vehiculo.routes.js';
import { marcaRouter } from './components/marca/marca.routes.js';
import { categoriaRouter } from './components/categoria/categoria.routes.js';
import { usuarioRouter } from './components/usuario/usuario.routes.js';
import { calificacionRouter } from './components/calificacion/calificacion.routes.js';
import { compraRouter } from './components/compra/compra.routes.js';
import { faqRouter } from './components/faq/faq.routes.js';
import { verificarToken } from './middleware/authMiddleware.js';
import { verificarRol } from './middleware/authMiddleware.js';
import cors from 'cors';
import { alquilerRouter } from './components/alquiler/alquiler.routes.js';
import { recuperacionRouter } from './components/reset-password/passwordResetToken.routes.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import path from 'path';
import './config/cron.timelapse.js';

import { mercadoPagoRouter } from './components/mercadoPago/mercadopago.routes.js';

export const app = express();

const allowedOrigins = ['https://cargarage-frontend.netlify.app','http://localhost:4200', 'http://localhost:9876' ];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API Information',
      contact: {
        name: 'Developer',
      },
      servers: [{ url: 'http://localhost:3000' }], 
    },
  },
  apis: ['./dist/components/**/*.routes.js'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);


app.use(express.json());
  
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/api/categorias', categoriaRouter)
app.use('/api/marcas', marcaRouter);
app.use('/api/vehiculos', vehiculoRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/calificaciones', calificacionRouter);
app.use('/api/compras', compraRouter); 
app.use('/api/alquiler', alquilerRouter); 
app.use('/api/mercadopago', mercadoPagoRouter);
app.use('/api/recuperacion', recuperacionRouter);
app.use('/uploads', express.static(path.resolve('src/uploads')));
app.use('/api/faq', faqRouter);


app.use((_, res) => {
    return res.status(404).json({ message: "Resource not found" }); 
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});