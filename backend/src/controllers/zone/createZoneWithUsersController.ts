import { Request, Response } from "express";
import prisma from "../../config/db";
import { v4 as generateUuid } from "uuid";

export const createZoneWithUsersController = async (
  req: Request,
  res: Response
) => {
  const { selectedUsers, zone, allowedBy } = req.body;
  const id = generateUuid();
  const { name, description, location } = zone;
  try {
    await prisma.zone.create({
      data: {
        id,
        name,
        description,
        location,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    for (const user of selectedUsers) {
      await prisma.userToZone.create({
        data: {
          id: generateUuid(),
          userId: user,
          zoneId: id,
          allowedBy,
        },
      });
    }
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
