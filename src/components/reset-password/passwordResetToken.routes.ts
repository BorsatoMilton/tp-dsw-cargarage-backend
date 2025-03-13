import { Router } from "express";
import { addToken, validateToken } from "./passwordResetToken.controller.js";

export const recuperacionRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AddTokenRequest:
 *       type: object
 *       properties:
 *         destinatario:
 *           type: string
 *           description: Correo electrónico del destinatario
 *       required:
 *         - destinatario
 *     ValidateTokenResponse:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 *           description: Estado de la validación
 *         message:
 *           type: string
 *           description: Mensaje de la validación
 */

/**
 * @swagger
 * /api/recuperacion:
 *   post:
 *     summary: Crea un token de restablecimiento de contraseña y envía un correo electrónico
 *     tags: [PasswordResetToken]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddTokenRequest'
 *     responses:
 *       201:
 *         description: Token creado y correo enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Estado de la operación
 *                 message:
 *                   type: string
 *                   description: Mensaje de la operación
 *                 info:
 *                   type: string
 *                   description: Información adicional
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Estado de la operación
 *                 message:
 *                   type: string
 *                   description: Mensaje de la operación
 *       500:
 *         description: Error al crear el token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   description: Estado de la operación
 *                 message:
 *                   type: string
 *                   description: Mensaje de la operación
 *                 error:
 *                   type: string
 *                   description: Detalles del error
 */
recuperacionRouter.post("/", addToken);

/**
 * @swagger
 * /api/recuperacion/:token:
 *   get:
 *     summary: Valida un token de restablecimiento de contraseña
 *     tags: [PasswordResetToken]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de restablecimiento de contraseña
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidateTokenResponse'
 *       400:
 *         description: Token expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidateTokenResponse'
 *       404:
 *         description: Token no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidateTokenResponse'
 */
recuperacionRouter.get("/validate/:token", validateToken);
