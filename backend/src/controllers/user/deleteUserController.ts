import { Request, Response } from "express";
import prisma from "../../config/db";

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.delete({
      where: { id: userId },
      
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};
