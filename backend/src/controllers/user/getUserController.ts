import { Request, Response } from "express";
import prisma from "../../config/db";

export const getUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      Department: true,
      AccessLog: true,
    },
  });
  res.status(200).json(user);
};
