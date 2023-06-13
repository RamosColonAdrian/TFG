//Controlador que actualiza un usuario
import { Request, Response } from "express";
import prisma from "../../config/db";

export const updateUserController = async (req: Request, res: Response) => {
  // Obtenemos el id del usuario de la ruta y los datos del usuario de la petición
  const userId = req.params.id;
  const updatedUser = req.body;

  try {
    // Actualizamos el usuario en la base de datos con los nuevos datos y la fecha de actualización
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updatedUser,
        updatedAt: new Date(),
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};
