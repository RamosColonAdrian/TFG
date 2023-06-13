// Controlador que actualiza una zona de la base de datos
import { Request, Response } from "express";
import prisma from "../../config/db";

export const updateZoneController = async (req: Request, res: Response) => {
  const zoneId = req.params.id;
  const updatedZone = req.body;

  try {
    const zone = await prisma.zone.update({
      where: { id: zoneId },
      data: {
        ...updatedZone,
        updatedAt: new Date(),
      },
    });
    res.json(zone);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating zone");
  }
};
