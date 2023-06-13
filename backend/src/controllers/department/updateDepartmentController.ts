// Controlador que actualiza un departamento de la base de datos
import prisma from "../../config/db";
import { Request, Response } from "express";

export const updateDepartmentController = async (
  req: Request,
  res: Response
) => {
  // Obtenemos el id del departamento de la ruta y los datos del departamento de la petición
  const { id } = req.params;
  const { department } = req.body;

  // Actualizamos el departamento en la base de datos con los nuevos datos
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
