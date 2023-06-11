import prisma from "../../config/db";
import { Request, Response } from "express";

export const deleteDepartmentController = async (
  req: Request,
  res: Response
) => {
    const id = req.params.id;
    console.log(id);
    const departments = await prisma.department.delete({
        where: {
           id
        },
    });
    return res.status(200).json(departments);
};
