// Controlador para el login de usuarios 
import { compare } from "bcryptjs";
import prisma from "../../config/db";
import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import { Request, Response } from "express";

export const loginController = async (req: Request, res: Response) => {
  // Obtenemos el token de la cabecera
  const auth = req.headers.authorization as string | undefined;

  let existingUser: User | null;

  // Si existe el token, lo verificamos y obtenemos el usuario
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
    // Si no existe el token, obtenemos el usuario por email y comprobamos la contraseña
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

  // Si el usuario existe y la contraseña es correcta, generamos un token y lo enviamos junto con los datos del usuario
  const { hashedPassword, ...restOfUser } = existingUser;

  const token = sign({ email: existingUser.email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.status(200).json({ user: restOfUser, token });
};
