//Controlador que se encarga de crear una entrada en la tabla de userToZone para establecer que un usuario tiene acceso a una zona
import { Request, Response } from "express";
import prisma from "../../config/db";
import { v4 as generateUuid } from "uuid";

export const createUserToZoneController = async (
  req: Request,
  res: Response
) => {
  // Obtenemos los datos del usuario y la zona de la petición
  const { userId, zoneId, allowedById } = req.body as {
    userId: string;
    zoneId: string;
    allowedById: string;
  };
  try {
    // Creamos la entrada en la base de datos
    await prisma.userToZone.create({
      data: {
        id: generateUuid(),
        userId,
        zoneId,
        allowedBy: allowedById,
      },
    });

    // Obtenemos la zona con los usuarios que tienen acceso a ella
    const zone = await prisma.zone.findUnique({
      where: {
        id: zoneId,
      },
      include: {
        UserToZone: {
          include: {
            User: true,
          },
        },
      },
    });

    res.status(200).json(zone);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
