import { Router } from "express";
import {
  findAllFaq,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  sanitizeFaqInput,
} from "./faq.controller.js";
import {
  verificarRol,
  verificarToken,
} from "../../middleware/authMiddleware.js";

export const faqRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FAQ:
 *       type: object
 *       required:
 *         - pregunta
 *         - respuesta
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único de la FAQ
 *         pregunta:
 *           type: string
 *           description: La pregunta de la FAQ
 *         respuesta:
 *           type: string
 *           description: La respuesta de la FAQ
 *       example:
 *         id: faqId123
 *         pregunta: ¿Cómo puedo registrarme?
 *         respuesta: Puedes registrarte haciendo clic en el botón de registro.
 */

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Obtiene todas las FAQs
 *     tags: [FAQ]
 *     responses:
 *       200:
 *         description: Lista de FAQs obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FAQ'
 *       500:
 *         description: Error al obtener las FAQs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las FAQs
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
faqRouter.get("/", findAllFaq);

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: Agrega una nueva FAQ
 *     tags: [FAQ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FAQ'
 *     responses:
 *       200:
 *         description: FAQ agregada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQ'
 *       500:
 *         description: Error al agregar la FAQ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al agregar la FAQ
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
faqRouter.post(
  "/",
  verificarToken,
  verificarRol("ADMIN"),
  sanitizeFaqInput,
  addFAQ
);

/**
 * @swagger
 * /api/faqs/{id}:
 *   put:
 *     summary: Actualiza una FAQ
 *     tags: [FAQ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la FAQ
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FAQ'
 *     responses:
 *       200:
 *         description: FAQ actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQ'
 *       500:
 *         description: Error al actualizar la FAQ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar la FAQ
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
faqRouter.put(
  "/:id",
  verificarToken,
  verificarRol("ADMIN"),
  sanitizeFaqInput,
  updateFAQ
);

/**
 * @swagger
 * /api/faqs/{id}:
 *   delete:
 *     summary: Elimina una FAQ
 *     tags: [FAQ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la FAQ
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: FAQ eliminada exitosamente
 *       500:
 *         description: Error al eliminar la FAQ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar la FAQ
 *                 error:
 *                   type: string
 *                   example: Detalles del error
 */
faqRouter.delete("/:id", verificarToken, verificarRol("ADMIN"), deleteFAQ);
