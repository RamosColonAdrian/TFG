import { Request, Response } from "express";
import prisma from "../../config/db";

export const updateUserController = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updatedUser,
        updatedAt: new Date(),
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};
