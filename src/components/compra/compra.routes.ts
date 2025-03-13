import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  remove,
  sanitizeCompraInput,
  findOneByVehiculo,
  confirmarCompraMail,
  cancelarCompra,
  avisoCompraExitosa,
  findAllByUser,
  confirmarCompra,
} from "./compra.controller.js";
import {
  verificarRol,
  verificarToken,
} from "../../middleware/authMiddleware.js";

export const compraRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Compra:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la compra
 *         fechaCompra:
 *           type: string
 *           format: date-time
 *           description: Fecha de la compra
 *         fechaLimiteConfirmacion:
 *           type: string
 *           format: date-time
 *           description: Fecha límite para el pago
 *         fechaCancelacion:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Fecha de cancelación (si aplica)
 *         usuario:
 *           $ref: '#/components/schemas/Usuario'
 *         vehiculo:
 *           $ref: '#/components/schemas/Vehiculo'
 *       required:
 *         - fechaCompra
 *         - fechaLimiteConfirmacion
 *         - usuario
 *         - vehiculo
 */

/**
 * @swagger
 * /api/compras:
 *   get:
 *     summary: Obtiene todas las compras
 *     tags: [Compra]
 *     responses:
 *       200:
 *         description: Lista de compras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Compra'
 *       500:
 *         description: Error al obtener las compras
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las compras
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.get("/", verificarToken, verificarRol("ADMIN"), findAll);

/**
 * @swagger
 * /api/compras/byuser/{id}:
 *   get:
 *     summary: Obtiene compras por ID de usuario
 *     tags: [Compra]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de compras del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Compra'
 *       500:
 *         description: Error al obtener las compras por usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las compras por usuario
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.get("/byuser/:userId", verificarToken, findAllByUser);

/**
 * @swagger
 * /api/compras/byvehiculo/:idVehiculo:
 *   get:
 *     summary: Obtiene compras por ID de vehículo
 *     tags: [Compra]
 *     parameters:
 *       - in: path
 *         name: idVehiculo
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Lista de compras del vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Compra'
 *       500:
 *         description: Error al obtener las compras por vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las compras por vehículo
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.get("/:id", findOne);

/**
 * @swagger
 * /api/compras/byvehiculo/{idVehiculo}:
 *   get:
 *     summary: Obtiene compras por ID de vehículo
 *     tags: [Compra]
 *     parameters:
 *       - in: path
 *         name: idVehiculo
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Lista de compras del vehículo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Compra'
 *       500:
 *         description: Error al obtener las compras por vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las compras por vehículo
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.get("/byvehiculo/:idVehiculo", verificarToken, findOneByVehiculo);

/**
 * @swagger
 * /api/compras:
 *   post:
 *     summary: Crea una nueva compra
 *     tags: [Compra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Compra'
 *     responses:
 *       201:
 *         description: Compra creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Compra'
 *       500:
 *         description: Error al crear la compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear la compra
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.post("/", verificarToken, sanitizeCompraInput, add);

/**
 * @swagger
 * /api/compras/avisoCompraExitosa:
 *   post:
 *     summary: Envía aviso de compra exitosa
 *     tags: [Compra]
 *     responses:
 *       200:
 *         description: Aviso enviado correctamente
 *       500:
 *         description: Error al enviar el aviso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al enviar el aviso
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.post(
  "/avisoCompraExitosa/:mail",
  verificarToken,
  avisoCompraExitosa
);

/**
 * @swagger
 * /api/compras/confirmarMailCompra:
 *   post:
 *     summary: Confirma una compra
 *     tags: [Compra]
 *     responses:
 *       200:
 *         description: Compra confirmada correctamente
 *       500:
 *         description: Error al confirmar la compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al confirmar la compra
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.post(
  "/confirmarMailCompra/:idCompra",
  verificarToken,
  confirmarCompraMail
);

/**
 * @swagger
 * /api/compras/confirmarCompra:
 *   patch:
 *     summary: Confirma una compra
 *     tags: [Compra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idCompra:
 *                 type: string
 *                 description: ID de la compra a confirmar
 *     responses:
 *       200:
 *         description: Compra confirmada exitosamente
 *       400:
 *         description: ID de compra requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El id de la compra es requerido
 *                 data:
 *                  type: object
 *                 example: {Compra}
 *       404:
 *         description: Compra no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra no encontrada
 *       500:
 *         description: Error al confirmar la compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al confirmar la compra
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.patch("/confirmarCompra/:idCompra", confirmarCompra);

/**
 * @swagger
 * /api/compras/cancelarCompra:
 *   patch:
 *     summary: Cancela una compra
 *     tags: [Compra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la compra a cancelar
 *     responses:
 *       200:
 *         description: Compra cancelada exitosamente
 *       400:
 *         description: ID de compra requerido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El id de la compra es requerido
 *                 data:
 *                  type: object
 *                 example: {Compra}
 *       404:
 *         description: Compra no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra no encontrada
 *       500:
 *         description: Error al cancelar la compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al cancelar la compra
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.patch("/cancelarCompra/:id", verificarToken, cancelarCompra);

/**
 * @swagger
 * /api/compras/{id}:
 *   delete:
 *     summary: Elimina una compra
 *     tags: [Compra]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la compra
 *     responses:
 *       200:
 *         description: Compra eliminada exitosamente
 *       404:
 *         description: Compra no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Compra no encontrada
 *       500:
 *         description: Error al eliminar la compra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar la compra
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
compraRouter.delete("/:id", verificarToken, remove);
