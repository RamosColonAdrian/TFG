// Conteolador que obtiene las zonas permitidas de un usuario
import { Request, Response } from "express";
import prisma from "../../config/db";

export const getUserToZoneController = async (req: Request, res: Response) => {
  // Obtenemos el id del usuario de la ruta
  const { userId } = req.params;
  try {
    // Obtenemos las zonas permitidas del usuario
    const allowedZones = await prisma.zone.findMany({
      where: {
        UserToZone: {
          some: {
            userId,
          },
        },
      },
      include: {
        UserToZone: true,
      },
    });
    res.status(200).json(allowedZones);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
