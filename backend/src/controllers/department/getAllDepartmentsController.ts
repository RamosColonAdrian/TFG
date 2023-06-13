// Controlador que obtiene todos los departamentos de la base de datos
import prisma from "../../config/db";
import { Request, Response } from "express";

export const getAllDepartmentsController = async (
  req: Request,
  res: Response
) => {
  // Obtenemos el parametro de la query que indica si se quieren obtener los usuarios de cada departamento
  const { withUsers } = req.query as { withUsers: string };
  const withUsersBool = withUsers === "true";
  
  // Obtenemos todos los departamentos de la base de datos y los usuarios de cada departamento si se indica
  const departments = await prisma.department.findMany({
    include: {
      User: withUsersBool,
    },
  });
  res.status(200).json(departments);
};
