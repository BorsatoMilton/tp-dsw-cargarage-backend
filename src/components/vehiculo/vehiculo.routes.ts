import { Router } from "express";
import {
  sanitizeVehiculoInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  logicRemove,
  findAllByUser,
  findAllByCategory,
} from "./vehiculo.controller.js";
import upload from "../../config/multer.upload.images.js";
import { verificarToken } from "../../middleware/authMiddleware.js";

export const vehiculoRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehiculo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del vehículo
 *         modelo:
 *           type: string
 *           description: Modelo del vehículo
 *         descripcion:
 *           type: string
 *           description: Descripción del vehículo
 *         fechaAlta:
 *           type: string
 *           format: date-time
 *           example: 2021-10-01T00:00:00.000Z
 *           description: Fecha de alta del vehículo
 *         fechaBaja:
 *           type: string
 *           format: date-time
 *           example: 2022-10-01T00:00:00.000Z
 *           description: Fecha de baja del vehículo
 *         precioVenta:
 *           type: number
 *           minimum: 0
 *           description: Precio de venta del vehículo
 *         transmision:
 *           type: string
 *           description: Tipo de transmisión del vehículo
 *         precioAlquilerDiario:
 *           type: number
 *           minimum: 0
 *           description: Precio de alquiler diario del vehículo
 *         kilometros:
 *           type: number
 *           description: Kilometraje del vehículo
 *         anio:
 *           type: string
 *           description: Año del vehículo
 *         imagenes:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de URLs de imágenes del vehículo
 *         categoria:
 *           $ref: '#/components/schemas/Categoria'
 *         marca:
 *           $ref: '#/components/schemas/Marca'
 *         propietario:
 *           $ref: '#/components/schemas/Usuario'
 *       required:
 *         - modelo
 *         - descripcion
 *         - transmision
 *         - kilometros
 *         - categoria
 *         - marca
 *         - propietario
 *         - imagenes
 *         - fechaAlta
 */

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtiene una lista de todos los vehículos
 *     tags: [Vehiculo]
 *     responses:
 *       200:
 *         description: Lista de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 *       500:
 *         description: Error al obtener los vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los vehículos
 */
vehiculoRouter.get("/", findAll);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtiene un vehículo por su ID
 *     tags: [Vehiculo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehículo no encontrado
 *       500:
 *         description: Error al obtener el vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener el vehículo
 */
vehiculoRouter.get("/:id", verificarToken, findOne);

/**
 * @swagger
 * /api/vehiculos/user/:id:
 *   get:
 *     summary: Obtiene una lista de vehículos por ID de usuario
 *     tags: [Vehiculo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de vehículos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 *       500:
 *         description: Error al obtener los vehículos por usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los vehículos por usuario
 */
vehiculoRouter.get("/user/:id", verificarToken, findAllByUser);

/**
 * @swagger
 * /api/vehiculos/categoria/{id}:
 *   get:
 *     summary: Obtiene una lista de vehículos por ID de categoría
 *     tags: [Vehiculo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Lista de vehículos por categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehiculo'
 *       500:
 *         description: Error al obtener los vehículos por categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener los vehículos por categoría
 */
vehiculoRouter.get("/categoria/:id", verificarToken, findAllByCategory);

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crea un nuevo vehículo
 *     tags: [Vehiculo]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               sanitizedInput:
 *                 type: object
 *                 properties:
 *                   modelo:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   transmision:
 *                     type: string
 *                   kilometros:
 *                     type: number
 *                   anio:
 *                     type: string
 *                   precioVenta:
 *                     type: number
 *                   precioAlquilerDiario:
 *                     type: number
 *                   categoria:
 *                     type: string
 *                   marca:
 *                     type: string
 *                   propietario:
 *                     type: string
 *                   imagenes:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: binary
 *     responses:
 *       201:
 *         description: Vehículo creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehículo creado
 *                 data:
 *                   $ref: '#/components/schemas/Vehiculo'
 *       400:
 *         description: Ids de marca, categoría o propietario no válidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Ids de marca, categoría o propietario no válidos
 *       500:
 *         description: Error al crear el vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear el vehículo
 */
vehiculoRouter.post(
  "/",
  upload.array("imagenes", 10),
  verificarToken,
  sanitizeVehiculoInput,
  add
);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualiza un vehículo existente
 *     tags: [Vehiculo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehiculo'
 *     responses:
 *       200:
 *         description: Vehículo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehículo no encontrado
 *       500:
 *         description: Error al actualizar el vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar el vehículo
 */
vehiculoRouter.put("/:id", verificarToken, sanitizeVehiculoInput, update);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   patch:
 *     summary: Baja lógica de un vehículo existente
 *     tags: [Vehiculo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehiculo'
 *     responses:
 *       200:
 *         description: Vehículo dado de baja
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehículo no encontrado
 *       500:
 *         description: Error al dar de baja el vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al dar de baja el vehículo
 */
vehiculoRouter.patch("/:id", verificarToken, logicRemove);

/**
 * @swagger
 * /api/vehiculo/{id}:
 *   delete:
 *     summary: Elimina un vehículo existente
 *     tags: [Vehiculo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del vehículo
 *     responses:
 *       200:
 *         description: Vehículo eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehículo eliminado
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehículo no encontrado
 *       500:
 *         description: Error al eliminar el vehículo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar el vehículo
 */
vehiculoRouter.delete("/:id", verificarToken, remove);
