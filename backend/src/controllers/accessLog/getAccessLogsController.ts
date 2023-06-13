//Controlador que obtiene los logs de acceso de la base de datos
import { Request, Response } from "express";
import prisma from "../../config/db";

export const getAccessLogsController = async (req: Request, res: Response) => {
  // Obtenemos los parametros de la query
  const { username, sortBy, sortDirection } = req.query as {
    username?: string;
    sortBy?: string;
    sortDirection?: string;
  };

  try {
    let accessLogs;

    // Ordenamos los logs de acceso por el campo que se indique en la query
    const orderBy = {
      [sortBy as string]: sortDirection === "desc" ? "desc" : "asc",
    };

    // Si se indica un nombre de usuario, filtramos los logs de acceso por ese nombre
    if (username) {
      accessLogs = await prisma.accessLog.findMany({
        where: {
          User: {
            name: {
              contains: username,
              mode: "insensitive",
            },
          },
        },
        include: {
          User: true,
          Zone: true,
        },
        orderBy,
      });
    } else {
      // Si no se indica un nombre de usuario, obtenemos todos los logs de acceso
      accessLogs = await prisma.accessLog.findMany({
        include: {
          User: true,
          Zone: true,
        },
        orderBy,
      });
    }

    // Enviamos los logs de acceso
    res.status(200).json(accessLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el log de acceso" });
  }
};
