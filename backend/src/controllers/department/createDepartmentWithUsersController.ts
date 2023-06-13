// Controlador que crea un departamento en la base de datos y asigna los usuarios seleccionados a ese departamento
import prisma from "../../config/db";
import { v4 as generateUuid } from "uuid";
import { Request, Response } from "express";

export const createDepartmentWithUsersController = async (
  req: Request,
  res: Response
) => {
  // Obtenemos los datos del departamento y los usuarios seleccionados de la petición
  const { department, selectedUsers } = req.body;

  try {
    // Creamos el departamento en la base de datos
    const newDepartment = await prisma.department.create({
      data: {
        id: generateUuid(),
        ...department,
      },
    });
 
    // Asignamos los usuarios seleccionados al nuevo departamento
    for (const user of selectedUsers) {
      await prisma.user.update({
        where: {
          id: user,
        },
        data: {
          departmentId: newDepartment.id,
        },
      });
    }

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
