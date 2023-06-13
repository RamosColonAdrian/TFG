// Controlador que crea una zona en la base de datos
import { Request, Response } from "express";
import prisma from "../../config/db";
import { v4 as generateUuid } from "uuid";

export const createZoneController = async (req: Request, res: Response) => {
  const { name, description, location } = req.body;
  const id = generateUuid();
  try {
    const zone = await prisma.zone.create({
      data: {
        id,
        name,
        description,
        location,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    res.status(201).json(zone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la zona" });
  }
};
