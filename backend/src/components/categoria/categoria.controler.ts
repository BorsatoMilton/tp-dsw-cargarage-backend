import { Request, Response, NextFunction } from "express";
import { orm } from "../../shared/db/orm.js";
import { Categoria } from "./categoria.entity.js";

const em = orm.em;

function sanitizeModeloInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombreCategoria: req.body.nombreCategoria,
    descripcionCategoria: req.body.descripcionCategoria,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const categorias = await em.find(Categoria, {});
    res.status(200).json(categorias);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const categoria = await em.findOne(Categoria, { id });
    if(!categoria){
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    res.status(200).json(categoria);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOneByName(req: Request, res: Response) {
  try {
    const name = req.params.name.toUpperCase();
    const excludeCategoryId = req.query.excludeCategoryId;

    const query: any = {};

    if (name) {
      query.nombreCategoria = name;
    }
    if (excludeCategoryId) {
      query._id = { $ne: excludeCategoryId };
    }

    const categoria = await em.findOne(Categoria, query);
    if(!categoria){
      return res.status(200).json(null);
    }
    res.status(200).json(categoria);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    req.body.sanitizedInput.nombreCategoria = req.body.sanitizedInput.nombreCategoria.toUpperCase();
    const categoriaExistente = await em.findOne(Categoria, {
      nombreCategoria: req.body.sanitizedInput.nombreCategoria,
    });
    if (categoriaExistente) {
      return res.status(409).json({ message: "La categoria ya existe" });
    } else {
      const categoria = em.create(Categoria, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({ message: "Categoria creada", data: categoria });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    req.body.sanitizedInput.nombreCategoria = req.body.sanitizedInput.nombreCategoria.toUpperCase();
    const categoria = await em.findOne(Categoria, { id });
    if (!categoria) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    } else {
      em.assign(categoria, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json(categoria);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const categoria = await em.findOne(Categoria, { id: id }, {populate: ['vehiculos']});
    if (!categoria) {
      res.status(404).json({ message: "Categoria no encontrada" });
    } else {
      await em.removeAndFlush(categoria);
      res.status(200).json({ message: "Categoria Eliminada" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeModeloInput,
  findOneByName,
};
