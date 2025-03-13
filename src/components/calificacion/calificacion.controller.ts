import { Request, Response, NextFunction } from "express";
import { Calificacion } from "./calificacion.entity.js";
import { orm } from "../../shared/db/orm.js";

const em = orm.em;

function sanitizeCalificacionInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    fechaCalificacion: req.body.fechaCalificacion,
    valoracion: req.body.valoracion,
    comentario: req.body.comentario,
    usuario: req.body.usuario,
    alquiler: req.body.alquiler,
    compra: req.body.compra,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAllByUser(req: Request, res: Response) {
  try {
    const idUsuario = req.params.idUsuario;
    const calificaciones = await em.find(Calificacion, { usuario: idUsuario });
    res.status(200).json(calificaciones);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const calificacion = await em.findOneOrFail(Calificacion, { id });
    res
      .status(200)
      .json({ message: "Calificacion Encontrada", data: calificacion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOneByObjectAndUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const objectId = req.params.objectId;

    const calificacion = await em.findOne(Calificacion, {
      usuario: userId,
      $or: [{ alquiler: objectId }, { compra: objectId }],
    });

    if (!calificacion) {
      return res.status(404).json({ message: "Calificación no encontrada" });
    }

    res.status(200).json(calificacion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const calificacion = em.create(Calificacion, req.body.sanitizedInput);
    await em.flush();
    res
      .status(201)
      .json({ message: "Calificacion creada", data: calificacion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  sanitizeCalificacionInput,
  findAllByUser,
  findOne,
  findOneByObjectAndUser,
  add,
};
