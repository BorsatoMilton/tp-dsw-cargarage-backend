import { Router } from 'express';
import { createPreference } from './mercadopago.controller.js';
import { mercadoPagoWebhook } from '../webhooks/webhook.controller.js';
import { verificarToken } from '../../middleware/authMiddleware.js';

export const mercadoPagoRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentItem:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Título del ítem
 *         unit_price:
 *           type: number
 *           description: Precio unitario del ítem
 *         quantity:
 *           type: number
 *           description: Cantidad del ítem
 *       required:
 *         - title
 *         - unit_price
 *         - quantity
 *     PaymentPreference:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PaymentItem'
 *         external_reference:
 *           type: string
 *           description: Referencia externa para el pago
 *         rentalData:
 *           type: object
 *           description: Datos del alquiler
 *       required:
 *         - items
 *         - external_reference
 *         - rentalData
 */

/**
 * @swagger
 * /api/mercadopago/create-preference:
 *   post:
 *     summary: Crea una preferencia de pago en Mercado Pago
 *     tags: [MercadoPago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentPreference'
 *     responses:
 *       201:
 *         description: Preferencia de pago creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID de la preferencia de pago
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
mercadoPagoRouter.post('/create-preference' ,createPreference)

/**
 * @swagger
 * /api/mercadopago/webhook:
 *   post:
 *     summary: Webhook para recibir notificaciones de Mercado Pago
 *     tags: [MercadoPago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Tipo de notificación
 *               data:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID del pago
 *     responses:
 *       200:
 *         description: Notificación recibida correctamente
 *       404:
 *         description: Pago no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pago no encontrado
 *       409:
 *         description: El pago ya fue procesado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: El pago ya fue procesado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
mercadoPagoRouter.post('/webhook', mercadoPagoWebhook)
