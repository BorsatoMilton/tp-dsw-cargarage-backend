import dotenv from 'dotenv';
import { MercadoPagoConfig } from 'mercadopago';

dotenv.config();

export const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || ''
});
