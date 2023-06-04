import { Request, Response } from "express";
import prisma from "../../config/db";
import { v4 as generateUuid } from "uuid";

export const createUseerToZoneController = async (req: Request, res: Response) => {
  const { userId, zoneId, allowedById } = req.body as {
    userId: string;
    zoneId: string;
    allowedById: string;
  };
  try {
    await prisma.userToZone.create({
      data: {
        id: generateUuid(),
        userId,
        zoneId,
        allowedBy: allowedById,
      },
    });

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
