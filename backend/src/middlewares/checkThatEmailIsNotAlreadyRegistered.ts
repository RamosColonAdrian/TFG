import { NextFunction, Request, Response } from "express";
import prisma from "../config/db";

export default async function userExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //const email = req.body.email
  const { email } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    res.status(400).send("Email already registered");
    return;
  }
  next();
}
