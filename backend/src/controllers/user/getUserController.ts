//Controlador para obtener un usuario por id
import { Request, Response } from "express";
import prisma from "../../config/db";

export const getUserController = async (req: Request, res: Response) => {
  // Obtenemos el id del usuario de la ruta
  const { id } = req.params;

  // Obtenemos el usuario con sus departamentos y logs de acceso
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      Department: true,
      AccessLog: true,
    },
  });
  res.status(200).json(user);
};
