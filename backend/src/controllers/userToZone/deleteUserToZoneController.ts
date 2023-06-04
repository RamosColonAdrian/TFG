import { Request, Response } from "express";
import prisma from "../../config/db";

export const deleteUserToZoneController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.userToZone.delete({
      where: {
        id,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
