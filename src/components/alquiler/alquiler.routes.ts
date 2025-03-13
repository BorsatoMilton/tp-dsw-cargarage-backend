import { Router } from "express";
import {
  sanitizeAlquilerInput,
  findAll,
  findAllByVehicle,
  findAllByUser,
  findOne,
  add,
  remove,
  cancelRent,
  confirmarAlquilerMail,
  confirmRent,
} from "./alquiler.controller.js";
import {
  verificarRol,
  verificarToken,
} from "../../middleware/authMiddleware.js";

export const alquilerRouter = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Alquiler:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del alquiler
 *         fechaAlquiler:
 *           type: string
 *           format: date-time
 *           description: Fecha del alquiler
 *         fechaHoraInicioAlquiler:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de inicio del alquiler
 *         fechaHoraDevolucion:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de devolución del alquiler
 *         estadoAlquiler:
 *           type: string
 *           description: Estado del alquiler
 *         tiempoConfirmacion:
 *           type: string
 *           format: date-time
 *           description: Tiempo de confirmación del alquiler
 *         locatario:
 *             $ref: '#/components/schemas/Usuario'
 *         vehiculo:
 *             $ref: '#/components/schemas/Vehiculo'
 *       required:
 *         - fechaAlquiler
 *         - fechaHoraInicioAlquiler
 *         - fechaHoraDevolucion
 *         - estadoAlquiler
 *         - tiempoConfirmacion
 *         - locatario
 *         - vehiculo
 */

/**
 * @swagger
 * /api/alquiler:
 *   get:
 *     summary: Obtiene una lista de todos los alquileres
 *     tags: [Alquiler]
 *     responses:
 *       200:
 *         description: Lista de alquileres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alquiler'
 *       500:
 *         description: Error al obtener los alquileres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los alquileres
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
alquilerRouter.get("/", verificarToken, verificarRol("ADMIN"), findAll);

/**
 * @swagger
 * /api/alquiler/{id}:
 *   get:
 *     summary: Obtiene un alquiler por su ID
 *     tags: [Alquiler]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del alquiler
 *     responses:
 *       200:
 *         description: Alquiler encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alquiler'
 *       404:
 *         description: Alquiler no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Alquiler no encontrado
 *       500:
 *         description: Error al obtener el alquiler
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener el Alquiler
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */

alquilerRouter.get("/:id", findOne);
/**
 * @swagger
 * /api/alquiler/vehiculo/:id:
 *   get:
 *     summary: Obtiene una lista de alquileres por ID de vehículo
 *     tags: [Alquiler]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Lista de alquileres del vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alquiler'
 *       500:
 *         description: Error al obtener los alquileres por vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los alquileres por vehículo
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
alquilerRouter.get("/vehiculo/:id", verificarToken, findAllByVehicle);
/**
 * @swagger
 * /api/alquiler/usuario/:id:
 *   get:
 *     summary: Obtiene una lista de alquileres por ID de usuario
 *     tags: [Alquiler]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de alquileres del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alquiler'
 *       500:
 *         description: Error al obtener los alquileres por usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los alquileres por usuario
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */

alquilerRouter.get("/usuario/:id", verificarToken, findAllByUser);
/**
 * @swagger
 * /api/alquiler:
 *   post:
 *     summary: Crea un nuevo alquiler
 *     tags: [Alquiler]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alquiler'
 *     responses:
 *       201:
 *         description: Alquiler creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alquiler'
 *       500:
 *         description: Error al crear el alquiler
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear el alquiler
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
alquilerRouter.post("/", verificarToken, sanitizeAlquilerInput, add);
/**
 * @swagger
 * /api/alquiler/confirmarAlquilerMail/{id}:
 *   post:
 *     summary: Confirma un alquiler enviando un correo electrónico
 *     tags: [Alquiler]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del alquiler
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: object
 *                 description: Información del usuario
 *     responses:
 *       201:
 *         description: Alquiler confirmado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Alquiler confirmado
 *       404:
 *         description: Alquiler no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Alquiler no encontrado
 *       500:
 *         description: Error al confirmar el alquiler
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al confirmar el alquiler
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
alquilerRouter.post(
  "/confirmarAlquilerMail/:id",
  verificarToken,
  confirmarAlquilerMail
);

/**
 * @swagger
 * /api/alquiler/:id:
 *   patch:
 *     summary: Actualiza un alquiler existente
 *     tags: [Alquiler]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del alquiler
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alquiler'
 *     responses:
 *       200:
 *         description: Alquiler actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alquiler'
 *       500:
 *         description: Error al actualizar el alquiler
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar el alquiler
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
alquilerRouter.patch("/confirmarAlquiler/:id", confirmRent);
/**
 * @swagger
 * /api/alquiler/cancelar/:id:
 *   put:
 *     summary: Cancela un alquiler existente
 *     tags: [Alquiler]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del alquiler
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alquiler'
 *     responses:
 *       200:
 *         description: Alquiler cancelado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alquiler'
 *       500:
 *         description: Error al cancelar el alquiler
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al cancelar el alquiler
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
alquilerRouter.put("/cancelar/:id", verificarToken, cancelRent);

/**
 * @swagger
 * /api/alquiler/{id}:
 *   delete:
 *     summary: Elimina un alquiler existente
 *     tags: [Alquiler]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del alquiler
 *     responses:
 *       200:
 *         description: Alquiler eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alquiler'
 *       404:
 *         description: Alquiler no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Alquiler no encontrado
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 *       500:
 *         description: Error al eliminar el alquiler
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el alquiler
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
alquilerRouter.delete("/:id", verificarToken, remove);
