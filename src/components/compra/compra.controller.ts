import { Request, Response, NextFunction } from "express";
import { Compra } from "./compra.entity.js";
import { orm } from "../../shared/db/orm.js";
import { findOneByEmail } from "../usuario/usuario.controller.js";
import { avisoCompraExitosaMail } from "../correo/correo.controller.js";
import { Vehiculo } from "../vehiculo/vehiculo.entity.js";
import { confirmarCompraMailCorreo } from "../correo/correo.controller.js";
import { Usuario } from "../usuario/usuario.entity.js";
import path from "path";
import fs from "fs";

const em = orm.em;

function sanitizeCompraInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    fechaCompra: new Date(),
    fechaLimiteConfirmacion: (() => {
      const fecha = new Date();
      fecha.setHours(fecha.getDate() + 24);
      return fecha;
    })(),
    fechaCancelacion: req.body.fechaCancelacion,
    usuario: req.body.comprador,
    vehiculo: req.body.vehiculo,
    estadoCompra: req.body.estado,
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
    const compras = await em.find(
      Compra,
      {},
      { populate: ["usuario", "vehiculo"] }
    );
    res.status(200).json(compras);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al obtener las compras", error: error.message });
  }
}

async function findAllByUser(req: Request, res: Response) {
  try {
    const idComprador = req.params.userId;
    const compras = await em.find(
      Compra,
      { usuario: idComprador },
      { populate: ["usuario", "vehiculo", "vehiculo.propietario"] }
    );
    res.status(200).json(compras);
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: "Error al obtener las compras por usuario",
        error: error.message,
      });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const compra = await em.findOne(
      Compra,
      { id },
      {
        populate: [
          "usuario",
          "vehiculo",
          "vehiculo.propietario",
          "vehiculo.marca",
          "vehiculo.categoria",
        ],
      }
    );
    if (!compra) {
      return res.status(200).json(null);
    }
    res.status(200).json(compra);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error al obtener la compra", error: error.messagee });
  }
}

async function findOneByVehiculo(req: Request, res: Response) {
  try {
    const idVehiculo = req.params.idVehiculo;
    const compra = await em.findOne(
      Compra,
      { vehiculo: idVehiculo },
      { populate: ["usuario", "vehiculo"] }
    );
    res.status(200).json(compra);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const usuario = await em.findOne(Usuario, {
      id: req.body.sanitizedInput.usuario,
    });
    const vehiculo = await em.findOne(Vehiculo, {
      id: req.body.sanitizedInput.vehiculo,
    });
    if (!usuario || !vehiculo) {
      return res
        .status(404)
        .json({ message: "Usuario o vehiculo no encontrado" });
    }
    const compraAdd = {
      ...req.body.sanitizedInput,
      estadoCompra: "PENDIENTE",
    };
    const compra = em.create(Compra, compraAdd);
    await em.flush();
    res.status(201).json(compra);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function avisoCompraExitosa(req: Request, res: Response) {
  try {
    const destinatario = req.params.mail;
    const idVehiculo = req.body.idVehiculo;
    const vehiculo = await em.findOne(
      Vehiculo,
      { id: idVehiculo },
      { populate: ["propietario", "marca", "categoria"] }
    );
    if (!destinatario) {
      return res
        .status(400)
        .json({ message: "El mail del destinatario es requerido" });
    }
    if (!idVehiculo) {
      return res
        .status(400)
        .json({ message: "El id del vehiculo es requerido" });
    }
    if (!vehiculo) {
      return res
        .status(404)
        .json({ ok: false, message: "Vehiculo no encontrado" });
    }
    const user = await findOneByEmail(destinatario);
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }
    const correoResultado = await avisoCompraExitosaMail(user, vehiculo);
    if (!correoResultado.ok) {
      return res
        .status(500)
        .json({
          ok: false,
          message: correoResultado.message,
          error: correoResultado.info,
        });
    }
    res
      .status(201)
      .json({
        ok: true,
        message: "Se ha confirmado la compra exitosamente",
        info: correoResultado.info,
      });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function confirmarCompra(req: Request, res: Response) {
  try {
    const idCompra = req.params.idCompra;
    if (!idCompra) {
      return res.status(400).json({ message: "La compra es requerida" });
    }
    const compra = await em.findOne(Compra, idCompra);
    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }
    compra.estadoCompra = "CONFIRMADA";

    await em.flush();
    res.status(200).json(compra);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function confirmarCompraMail(req: Request, res: Response) {
  try {
    const idCompra = req.params.idCompra;

    if (!idCompra) {
      return res.status(400).json({ message: "La compra es requerida" });
    }
    const compra = await em.findOneOrFail(
      Compra,
      { id: idCompra },
      { populate: ["usuario", "vehiculo", "vehiculo.marca"] }
    );
    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }
    const correoResultado = await confirmarCompraMailCorreo(compra);
    if (!correoResultado.ok) {
      return res
        .status(500)
        .json({
          message: correoResultado.message,
          error: correoResultado.info,
        });
    }
    res
      .status(201)
      .json({
        message: "Se ha enviado la confirmacion por mail exitosamente",
        info: correoResultado.info,
      });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function cancelarCompra(req: Request, res: Response) {
  try {
    const compraId = req.params.id;
    const compra = await em.findOne(Compra, { id: compraId });
    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }
    compra.estadoCompra = "CANCELADA";
    compra.fechaCancelacion = new Date();
    await em.flush();
    res.status(200).json(compra);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const compra = await em.findOne(Compra, { id: id });
    if (!compra) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }
    if (
      compra.estadoCompra === "FINALIZADA" ||
      compra.estadoCompra === "CONFIRMADA"
    ) {
      const vehiculo = await em.findOne(Vehiculo, { id: compra.vehiculo.id });
      if (!vehiculo) {
        return res.status(404).json({ message: "Vehiculo no encontrado" });
      }
      const imagePaths = vehiculo.imagenes?.map((imageName: string) =>
        path.resolve("src/uploads", imageName)
      );

      const unlinkPromises = imagePaths?.map((imagePath) => {
        return new Promise((resolve, reject) => {
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error al eliminar la imagen:", err);
              return reject(err);
            }
            console.log("Imagen eliminada correctamente:", imagePath);
            resolve(true);
          });
        });
      });
      if (unlinkPromises) {
        await Promise.all(unlinkPromises);
      }
      await em.removeAndFlush(vehiculo);
    }
    await em.removeAndFlush(compra);

    res.status(200).json({ message: "Compra eliminada" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export {
  sanitizeCompraInput,
  findAll,
  findAllByUser,
  findOne,
  findOneByVehiculo,
  add,
  confirmarCompraMail,
  confirmarCompra,
  cancelarCompra,
  avisoCompraExitosa,
  remove,
};
