import prisma from "../../config/db";
import { Request, Response } from "express";

export const updateDepartmentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { department } = req.body;

  try {
    await prisma.department.update({
      where: {
        id,
      },
      data: {
        ...department,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
