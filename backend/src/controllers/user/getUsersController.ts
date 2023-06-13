// Controlador que obtiene todos los usuarios de la base de datos
import { Request, Response } from "express";
import prisma from "../../config/db";

export const getUsersController = async (req: Request, res: Response) => {
  // Obtenemos el parametro de la query que indica si se quieren obtener los departamentos de cada usuario
  const { withDepartments } = req.query;
  const withDepartmentsBool = withDepartments === "true";
  const { page = 1 } = req.query;
  
  // Obtenemos todos los usuarios de la base de datos y los departamentos de cada usuario si se indica
  const users = await prisma.user.findMany({
    skip: (+page - 1) * 10,
    take: 10,
    include: {
      Department: withDepartmentsBool,
    },
  });

  res.status(200).json(users);
};
