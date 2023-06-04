import { Request, Response } from "express";
import prisma from "../../config/db";

export const getUsersController = async (req: Request, res: Response) => {
  const { withDepartments } = req.query;
  const withDepartmentsBool = withDepartments === "true";
  const { page = 1 } = req.query;
  const users = await prisma.user.findMany({
    skip: (+page - 1) * 10,
    take: 10,
    include: {
      Department: withDepartmentsBool,
    },
  });

  res.status(200).json(users);
};
