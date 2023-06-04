import { compare } from "bcryptjs";
import prisma from "../../config/db";
import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import { Request, Response } from "express";

export const loginController = async (req: Request, res: Response) => {
  const auth = req.headers.authorization as string | undefined;

  let existingUser: User | null;

  if (auth) {
    const realToken = auth.split(" ")[1];
    try {
      const decoded = verify(realToken, process.env.JWT_SECRET as string);

      existingUser = await prisma.user.findUnique({
        where: {
          email: (decoded as any).email,
        },
      });

      if (!existingUser) {
        return res.sendStatus(401);
      }
    } catch {
      return res.sendStatus(401);
    }
  } else {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.sendStatus(401);
    }

    const passwordMatches = await compare(
      password,
      existingUser.hashedPassword
    );

    if (!passwordMatches) {
      return res.sendStatus(401);
    }
  }

  const { hashedPassword, ...restOfUser } = existingUser;

  const token = sign({ email: existingUser.email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.status(200).json({ user: restOfUser, token });
};
