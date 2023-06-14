//Controlador que obtiene los logs de acceso de la base de datos
import { Request, Response } from "express";
import prisma from "../../config/db";

export const deleteAccessLogsController = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.accessLog.deleteMany();
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el log de acceso" });
  }
};
