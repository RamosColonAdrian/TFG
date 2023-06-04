import { Request, Response } from "express";
import prisma from "../../config/db";

export const deleteZoneController = async (req: Request, res: Response) => {
  const zoneId = req.params.id;

  try {
    await prisma.userToZone.deleteMany({
      where: {
        zoneId,
      },
    });

    await prisma.zone.delete({
      where: { id: zoneId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting zone");
  }
};
