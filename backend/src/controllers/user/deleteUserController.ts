//Controlador que elimina un usuario de la base de datos
import { Request, Response } from "express";
import prisma from "../../config/db";
import cloudinary from "../../../cloudinary_config";

export const deleteUserController = async (req: Request, res: Response) => {
  // Obtenemos el id del usuario de la ruta
  const userId = req.params.id;
  try {
    // Eliminamos el usuario de la base de datos
    const user = await prisma.user.delete({
      where: { id: userId },
    });
  
    // Eliminamos la imagen del usuario de Cloudinary
    await cloudinary.uploader.destroy(`face_recognition/${user.id}`);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};
