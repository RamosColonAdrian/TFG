//Controlador que obtiene una zona con sus usuarios
import { Request, Response } from "express";
import prisma from "../../config/db";

export const getZoneController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const zone = await prisma.zone.findUnique({
      where: {
        id,
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
    res.status(500).json({ error: "Error al obtener la zona" });
  }
};
