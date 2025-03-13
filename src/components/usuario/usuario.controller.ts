import { Request, Response, NextFunction } from "express";
import { Usuario } from "./usuario.entity.js";
import { orm } from "../../shared/db/orm.js";
import { PasswordResetToken } from "../reset-password/passwordResetToken.entity.js";
import bcrypt from "bcrypt";
import { Vehiculo } from "../vehiculo/vehiculo.entity.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const em = orm.em;

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    usuario: req.body.usuario,
    clave: req.body.clave,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    mail: req.body.mail,
    direccion: req.body.direccion,
    telefono: req.body.telefono,
    calificacion: req.body.calificacion,
    alquiler: req.body.alquiler,
    rol: req.body.rol,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (
      req.body.sanitizedInput[key] === undefined ||
      req.body.sanitizedInput[key] === null
    ) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(
      Usuario,
      {},
      { populate: ["vehiculos.compra", "compras", "alquilerLocatario"] }
    );
    res.status(200).json(usuarios);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOneByEmailOrUsername(req: Request, res: Response) {
  try {
    const { user, mail } = req.params;
    const excludeUserId = req.query.excludeUserId;

    const query: any = { $or: [] };

    if (user) query.$or.push({ usuario: user });
    if (mail) query.$or.push({ mail: mail });
    if (excludeUserId) query._id = { $ne: excludeUserId };

    const usuarioEncontrado = await em.findOne(Usuario, query);

    if (!usuarioEncontrado) {
      return res.status(200).json(null);
    }

    return res.status(200).json(usuarioEncontrado);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOneByEmailDestinatario(req: Request, res: Response) {
  try {
    const mail = req.params.mail;
    const usuarioEncontrado = await em.findOneOrFail(Usuario, { mail });
    if (!usuarioEncontrado) {
      return res.status(409).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(usuarioEncontrado);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOneById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const usuario = await em.findOneOrFail(Usuario, { id });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOneByEmail(email: string) {
  const usuario = await em.findOne(Usuario, { mail: email });
  try {
    return usuario;
  } catch (error: any) {
    return error.message;
  }
}

async function findOneByUser(req: Request, res: Response) {
  try {
    const user = req.params.user;
    const usuario = await em.findOne(Usuario, { usuario: user });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res.status(200).json(usuario);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function login(req: Request, res: Response) {
  try {
    const usuario = req.body.user;
    const clave = req.body.password;
    const usuarioEncontrado = await em.findOne(Usuario, { usuario: usuario });

    if (!usuarioEncontrado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      const isMatch = await bcrypt.compare(clave, usuarioEncontrado.clave);
      if (!isMatch) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }
      const token = jwt.sign(
        { id: usuarioEncontrado.id, rol: usuarioEncontrado.rol },
        process.env.SECRET_KEY_WEBTOKEN!,
        { expiresIn: "1h" }
      );

      res.status(200).json({ user: usuarioEncontrado, token: token });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function validatePassword(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const currentPassword = req.body.password;
    const usuario = await em.findOne(Usuario, { id: userId });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      const isMatch = await bcrypt.compare(currentPassword, usuario.clave);
      res.status(200).json(isMatch);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function validateToken(req: Request, res: Response) {
  try {
    const token = req.params.token;
    const tokenEntity = await em.findOne(PasswordResetToken, { token });
    if (!tokenEntity || tokenEntity.expiryDate < new Date()) {
      return res
        .status(404)
        .json({ ok: false, message: "Token inválido o expirado" });
    }
    return res.status(200).json({ ok: true, message: "Token válido" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function checkUsername(req: Request, res: Response) {
  try {
    const usuario = req.params.username;
    const usuarioEncontrado = await em.findOne(Usuario, { usuario: usuario });
    if (!usuarioEncontrado) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(true);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function checkEmail(req: Request, res: Response) {
  try {
    const mail = req.params.email;
    const usuarioEncontrado = await em.findOne(Usuario, { mail });
    if (!usuarioEncontrado) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(true);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const usuarioExistente = await em.findOne(Usuario, {
      $or: [
        { usuario: req.body.sanitizedInput.usuario },
        { mail: req.body.sanitizedInput.mail },
      ],
    });

    if (usuarioExistente) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }
    if (req.body.sanitizedInput.clave.length >= 6) {
      const vecesHash = 10;
      const hashClave = await bcrypt.hash(
        req.body.sanitizedInput.clave,
        vecesHash
      );

      const usuario = em.create(Usuario, {
        ...req.body.sanitizedInput,
        clave: hashClave,
      });

      await em.flush();

      const usuarioData = { ...usuario, clave: undefined };
      res.status(201).json({ message: "Usuario creado", data: usuarioData });
    } else {
      res
        .status(400)
        .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const usuarioAactualizar = await em.findOneOrFail(Usuario, { id });
    if (!usuarioAactualizar) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      if (req.body.sanitizedInput.clave) {
        return res
          .status(400)
          .json({
            message: "No se puede modificar la contraseña desde update",
          });
      }
      const usuario = {
        ...req.body.sanitizedInput,
        telefono: req.body.sanitizedInput.telefono.toString(),
      };

      em.assign(usuarioAactualizar, usuario);

      await em.flush();
      res
        .status(200)
        .json({ message: "Usuario Actualizado", data: usuarioAactualizar });
    }
  } catch (error: any) {
    console.error("Error detallado:", error);
    res.status(500).json({ message: error.message || "Error desconocido" });
  }
}

async function resetPasswordWithoutToken(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const newPassword = req.body.newPassword;

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({
          ok: false,
          message: "La contraseña debe tener al menos 6 caracteres",
        });
    }

    const usuario = await orm.em.findOne(Usuario, { id });
    if (!usuario) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }
    const vecesHash = 10;
    const hashClave = await bcrypt.hash(newPassword, vecesHash);
    usuario.clave = hashClave;
    await orm.em.persistAndFlush(usuario);
    return res
      .status(200)
      .json({ ok: true, message: "Contraseña actualizada exitosamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({
          ok: false,
          message: "La contraseña debe tener al menos 6 caracteres",
        });
    }
    const tokenEntity = await orm.em.findOne(PasswordResetToken, { token });
    if (!tokenEntity || tokenEntity.expiryDate < new Date()) {
      return res
        .status(400)
        .json({ ok: false, message: "Token inválido o expirado" });
    }

    const user = await orm.em.findOne(Usuario, tokenEntity.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "Usuario no encontrado" });
    }
    const vecesHash = 10;
    const hashClave = await bcrypt.hash(newPassword, vecesHash);
    user.clave = hashClave;
    await orm.em.persistAndFlush(user);
    await orm.em.removeAndFlush(tokenEntity);
    return res
      .status(200)
      .json({ ok: true, message: "Contraseña actualizada exitosamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const usuario = await em.findOne(
      Usuario,
      { id: id },
      { populate: ["calificacionesUsuario", "compras", "alquilerLocatario"] }
    );
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      await vehiclesUsersLogicRemove(usuario);
      await em.removeAndFlush(usuario);
      res.status(200).json("Usuario eliminado con exito");
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function vehiclesUsersLogicRemove(usuario: Usuario): Promise<void> {
  const vehiculos = await em.find(Vehiculo, { propietario: usuario.id });
  for (const vehiculo of vehiculos) {
    vehiculo.fechaBaja = new Date();
    await em.persistAndFlush(vehiculo);
  }
}

export {
  sanitizeUsuarioInput,
  findAll,
  findOneById,
  findOneByEmail,
  findOneByUser,
  validatePassword,
  checkUsername,
  checkEmail,
  resetPassword,
  resetPasswordWithoutToken,
  add,
  update,
  remove,
  login,
  findOneByEmailOrUsername,
  findOneByEmailDestinatario,
  validateToken,
};
