import prisma from "../../config/db";
import { Request, Response } from "express";

export const getAllDepartmentsController = async (
  req: Request,
  res: Response
) => {
  const { withUsers } = req.query as { withUsers: string };
  const withUsersBool = withUsers === "true";
  const departments = await prisma.department.findMany({
    include: {
      User: withUsersBool,
    },
  });
  res.status(200).json(departments);
};
