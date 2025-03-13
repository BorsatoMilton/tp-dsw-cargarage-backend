import { Router } from "express";
import {
  findAllByUser,
  findOne,
  add,
  findOneByObjectAndUser,
  sanitizeCalificacionInput,
} from "./calificacion.controller.js";
import { verificarToken } from "../../middleware/authMiddleware.js";

export const calificacionRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Calificacion:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único de la calificación
 *         fechaCalificacion:
 *           type: string
 *           format: date-time
 *           description: Fecha en que se realizó la calificación
 *         valoracion:
 *           type: number
 *           description: Valor numérico de la calificación
 *         comentario:
 *           type: string
 *           nullable: true
 *           description: Comentario asociado a la calificación
 *         usuario:
 *           type: string
 *           description: ID del usuario que realizó la calificación
 *         alquiler:
 *           $ref: '#/components/schemas/Alquiler'
 *       required:
 *         - fechaCalificacion
 *         - valoracion
 *         - usuario
 *         - alquiler
 */

/**
 * @swagger
 * tags:
 *   name: Calificaciones
 *   description: API para gestionar calificaciones de alquileres
 */

/**
 * @swagger
 * /api/calificaciones:
 *   get:
 *     summary: Obtiene todas las calificaciones de un usuario
 *     tags: [Calificaciones]
 *     responses:
 *       200:
 *         description: Lista de calificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Calificacion'
 *       500:
 *         description: Error interno del servidor
 *         message:
 *              type: string
 *              example: Error al obtener las calificaciones
 */

calificacionRouter.get("/:idUsuario", verificarToken, findAllByUser);

/**
 * @swagger
 * /api/calificaciones/{userId}/{objectId}:
 *   get:
 *     summary: Obtiene una calificación por usuario y alquiler
 *     tags: [Calificaciones]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario que realizó la calificación
 *         schema:
 *           type: string
 *       - in: path
 *         name: objectId
 *         required: true
 *         description: ID del alquiler relacionado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calificación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calificacion'
 *       500:
 *         description: Error interno del servidor
 */
calificacionRouter.get(
  "/:userId/:objectId",
  verificarToken,
  findOneByObjectAndUser
);

/**
 * @swagger
 * /api/calificaciones:
 *   post:
 *     summary: Crea una nueva calificación
 *     tags: [Calificaciones]
 *     requestBody:
 *       description: Datos de la calificación a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calificacion'
 *     responses:
 *       201:
 *         description: Calificación creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Calificacion'
 *       400:
 *         description: Error de validación o calificación ya existente
 *         message:
 *            type: string
 *            example: Ya has calificado a este usuario por este alquiler.
 *       500:
 *         description: Error interno del servidor
 *         message:
 *              type: string
 *              example: Error al crear la calificación
 */

calificacionRouter.post("/", verificarToken, sanitizeCalificacionInput, add);
