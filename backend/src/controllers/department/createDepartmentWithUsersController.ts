import prisma from "../../config/db";
import { v4 as generateUuid } from "uuid";
import { Request, Response } from "express";

export const createDepartmentWithUsersController = async (
  req: Request,
  res: Response
) => {
  const { department, selectedUsers } = req.body;

  try {
    const newDepartment = await prisma.department.create({
      data: {
        id: generateUuid(),
        ...department,
      },
    });

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
