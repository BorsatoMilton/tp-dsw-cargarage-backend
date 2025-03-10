import { Router } from 'express';
import { sanitizeModeloInput, findAll, findOne, add, update, remove, findOneByName } from './marca.controller.js';
import { verificarRol, verificarToken } from '../../middleware/authMiddleware.js';

export const marcaRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Marca:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único de la marca
 *         nombreMarca:
 *           type: string
 *           description: Nombre de la marca
 *       required:
 *         - nombreMarca
 */

/**
 * @swagger
 * /api/marcas:
 *   get:
 *     summary: Obtiene una lista de todas las marcas
 *     tags: [Marca]
 *     responses:
 *       200:
 *         description: Lista de marcas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Marca'
 *       500:
 *         description: Error al obtener las marcas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las marcas
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
marcaRouter.get('/', findAll);

/**
 * @swagger
 * /api/marcas/{id}:
 *   get:
 *     summary: Obtiene una marca por su ID
 *     tags: [Marca]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la marca
 *     responses:
 *       200:
 *         description: Marca encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       404:
 *         description: Marca no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Marca no encontrada
 *       500:
 *         description: Error al obtener la marca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la marca
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
marcaRouter.get('/:id', verificarToken, verificarRol('ADMIN'),findOne); //NO SE USA CREO

/**
 * @swagger
 * /api/marcas/byname/{name}:
 *   get:
 *     summary: Obtiene una marca por su nombre
 *     tags: [Marca]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la marca
 *     responses:
 *       200:
 *         description: Marca encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       404:
 *         description: Marca no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Marca no encontrada
 *       500:
 *         description: Error al obtener la marca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la marca
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
marcaRouter.get('/byname/:name', verificarToken, verificarRol('ADMIN'), findOneByName);

/**
 * @swagger
 * /api/marcas:
 *   post:
 *     summary: Crea una nueva marca
 *     tags: [Marca]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Marca'
 *     responses:
 *       201:
 *         description: Marca creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       400:
 *         description: La marca ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La marca ya existe
 *       500:
 *         description: Error al crear la marca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear la marca
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
marcaRouter.post('/', verificarToken, verificarRol('ADMIN'),sanitizeModeloInput, add);

/**
 * @swagger
 * /api/marcas/{id}:
 *   put:
 *     summary: Actualiza una marca existente
 *     tags: [Marca]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la marca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Marca'
 *     responses:
 *       200:
 *         description: Marca actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Marca'
 *       404:
 *         description: Marca no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Marca no encontrada
 *       500:
 *         description: Error al actualizar la marca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar la marca
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
marcaRouter.put('/:id', verificarToken, verificarRol('ADMIN'), sanitizeModeloInput, update);

/**
 * @swagger
 * /api/marcas/{id}:
 *   delete:
 *     summary: Elimina una marca existente
 *     tags: [Marca]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la marca
 *     responses:
 *       200:
 *         description: Marca eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Marca eliminada
 *       404:
 *         description: Marca no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Marca no encontrada
 *       500:
 *         description: Error al eliminar la marca
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar la marca
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
marcaRouter.delete('/:id', verificarToken, verificarRol('ADMIN'), remove);