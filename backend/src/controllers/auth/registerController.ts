import { hash } from "bcryptjs";
import prisma from "../../config/db";
import { v4 as generateUuid } from "uuid";
import { Request, Response } from "express";

export const registerController = async (req: Request, res: Response) => {
  const { email, password, name, surname } = req.body as {
    email: string;
    password: string;
    name: string;
    surname: string;
  };

  const picture = "https://res.cloudinary.com/dqrqizfkt/image/upload/v1685816526/default/default_user.png";

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: {
      id: generateUuid(),
      email,
      hashedPassword,
      name,
      surname,
      picture,
    },
  });
  res.sendStatus(201);
};
