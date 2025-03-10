import { Router } from 'express';
import { sanitizeModeloInput, findAll, findOne, add, update, remove, findOneByName } from './categoria.controller.js';
import { verificarRol, verificarToken } from '../../middleware/authMiddleware.js';

export const categoriaRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único de la categoría
 *         nombreCategoria:
 *           type: string
 *           description: Nombre de la categoría
 *         descripcionCategoria:
 *           type: string
 *           description: Descripción de la categoría
 *       required:
 *         - nombreCategoria
 *         - descripcionCategoria
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtiene una lista de todas las categorías
 *     tags: [Categoria]
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       500:
 *         description: Error al obtener las categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las categorías
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
categoriaRouter.get('/', findAll);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtiene una categoría por su ID
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría no encontrada
 *       500:
 *         description: Error al obtener la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la categoría
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
categoriaRouter.get('/:id', verificarToken, verificarRol('ADMIN'), findOne); //NO SE USA CREO

/**
 * @swagger
 * /api/categorias/byname/{name}:
 *   get:
 *     summary: Obtiene una categoría por su nombre
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría no encontrada
 *       500:
 *         description: Error al obtener la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener la categoría
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
categoriaRouter.get('/byname/:name', verificarToken, verificarRol('ADMIN'),findOneByName);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categoria]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoría creada
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *               message:
 *                type: string
 *                example: Categoría creada
 *              data:
 *                type: object
 *                $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: La categoría ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La categoría ya existe
 *       500:
 *         description: Error al crear la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear la categoría
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
categoriaRouter.post('/', verificarToken, verificarRol('ADMIN'), sanitizeModeloInput, add);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualiza una categoría existente
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría no encontrada
 *       500:
 *         description: Error al actualizar la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar la categoría
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
categoriaRouter.put('/:id', verificarToken, verificarRol('ADMIN'), sanitizeModeloInput, update);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Elimina una categoría existente
 *     tags: [Categoria]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categoría no encontrada
 *       500:
 *         description: Error al eliminar la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar la categoría
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
categoriaRouter.delete('/:id', verificarToken, verificarRol('ADMIN'), remove);