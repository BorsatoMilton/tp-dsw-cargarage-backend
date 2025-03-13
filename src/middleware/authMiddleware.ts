import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY_WEBTOKEN as string;

interface Usuario {
  id: string;
  rol: string;
}

export function verificarToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const usuario = jwt.verify(token, SECRET_KEY) as Usuario | undefined;

    if (!usuario) {
      return res.status(403).json({ mensaje: "Token inválido." });
    }

    req.body.userToken = usuario;
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido." });
  }
}

export function verificarRol(rolRequerido: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = req.body.userToken as Usuario;

    if (!usuario || usuario.rol !== rolRequerido) {
      return res
        .status(403)
        .json({ mensaje: "Acceso denegado. No tienes permisos suficientes." });
    }
    next();
  };
}
