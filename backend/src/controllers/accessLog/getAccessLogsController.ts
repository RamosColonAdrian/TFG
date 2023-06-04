import { Request, Response } from "express";
import prisma from "../../config/db";

export const getAccessLogsController = async (req: Request, res: Response) => {
  const { username, sortBy, sortDirection } = req.query as {
    username?: string;
    sortBy?: string;
    sortDirection?: string;
  };

  try {
    let accessLogs;

    const orderBy = {
      [sortBy as string]: sortDirection === "desc" ? "desc" : "asc",
    };

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
      accessLogs = await prisma.accessLog.findMany({
        include: {
          User: true,
          Zone: true,
        },
        orderBy,
      });
    }

    res.status(200).json(accessLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el log de acceso" });
  }
};
