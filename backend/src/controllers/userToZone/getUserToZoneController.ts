import { Request, Response } from "express";
import prisma from "../../config/db";

export const getUserToZoneController = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
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
