import { Request, Response } from "express";
import prisma from "../../config/db";

export const getZonesController = async (req: Request, res: Response) => {
  const { withUsers } = req.query;
  const withUsersBool = withUsers === "true";
  const zones = await prisma.zone.findMany({
    ...(withUsersBool && {
      include: {
        UserToZone: {
          include: {
            User: true,
          },
        },
      },
    }),
  });
  res.status(200).json(zones);
};
