import { Router } from "express";
import { recuperarContraseña } from "./correo.controller.js";

export const correoRouter = Router();

/**
 * @swagger
 * /api/recuperacion/:
 *   post:
 *     summary: Envía correo para recuperación de clave
 *     tags: [Correo]
 *     parameters:
 *       - in: body
 *         name: destinatario
 *         description: Correo electrónico del destinatario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Correo enviado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 info:
 *                   type: string
 *             example:
 *               ok: true
 *               message: "Correo enviado correctamente"
 *               info: "Correo enviado"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               ok: false
 *               message: "Usuario no encontrado"
 *       500:
 *         description: Error al enviar el correo de recuperación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               ok: false
 *               message: "Error al enviar el correo de recuperación"
 *               error: "Detalles del error"
 */
//correoRouter.post("/", recuperarContraseña);
