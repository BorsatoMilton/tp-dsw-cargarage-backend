import { NextFunction, Request, Response } from "express";
import { MikroORM } from "@mikro-orm/core";
import { Faq } from "./faq.entity.js";
import { orm } from "../../shared/db/orm.js";

const em = orm.em.fork();

function sanitizeFaqInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    pregunta: req.body.pregunta,
    respuesta: req.body.respuesta,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}


  async function findAllFaq(req: Request, res: Response): Promise<void> {
    try {
      const faqs = await em.find(Faq, {});
      res.status(200).json(faqs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  }

  async function addFAQ(req: Request, res: Response): Promise<void> {
    try {
      const faq = await em.create(Faq, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json(faq);
    } catch (error) {
      res.status(500).json({ error: "Failed to add FAQ" });
    }
  }

  async function updateFAQ(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const faq = await em.findOne(Faq, { id: id });
      if (!faq) {
        res.status(404).json({ error: "FAQ not found" });
        return;
      }
      em.assign(faq, req.body.sanitizedInput);
      await em.persistAndFlush(faq);
      res.status(200).json(faq);
    } catch (error) {
      res.status(500).json({ error: "Failed to update FAQ" });
    }
  }

  async function deleteFAQ(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
      const faq = await em.findOne(Faq, { id: id });
      if (!faq) {
        res.status(404).json({ error: "FAQ not found" });
        return;
      }

      await em.removeAndFlush(faq);
      res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete FAQ" });
    }
  }

export { sanitizeFaqInput, findAllFaq, addFAQ, updateFAQ, deleteFAQ };