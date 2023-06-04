import prisma from "../../config/db";
import { Request, Response } from "express";

export const getDepartmentWithUsersController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
      include: {
        User: true,
      },
    });

    res.status(200).json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el departamento" });
  }
};
