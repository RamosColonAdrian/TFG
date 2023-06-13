// Controlador que se encarga de reconocer una cara en una imagen y comprobar si pertenece a un usuario de la zona
import { Request, Response } from "express";
import axios from "axios";
import prisma from "../../config/db";
import { v4 as generateUuid } from "uuid";
import FormData from "form-data";

export const recognizeFaceController = async (req: Request, res: Response) => {
  // Obtenemos la imagen y el id de la zona de la petición
  const img = req.file;
  const { zoneId } = req.body as { zoneId: string };

  // Creamos un formData con la imagen para enviarla al modelo
  const formData = new FormData();
  formData.append("img", img?.buffer, {
    filename: img?.originalname,
    contentType: img?.mimetype,
  });

  try {
    // Enviamos la imagen al modelo para que la reconozca
    const { data } = await axios.post(
      `${process.env.MODEL_URL}/classify`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );


    // Si el modelo no reconoce la cara, devolvemos un mensaje de error
    if (data === "Desconocido") {
      return res.send({ message: data });
    }

    // Buscamos en la base de datos si el usuario pertenece a la zona
    const userToZone = await prisma.userToZone.findFirst({
      where: {
        userId: data,
        zoneId,
      },
      include: {
        User: true,
      },
    });

    // Si el usuario no pertenece a la zona, devolvemos un mensaje de error y guardamos el acceso denegado en la base de datos
    if (!userToZone) {
      await prisma.accessLog.create({
        data: {
          id: generateUuid(),
          userId: data,
          access: false,
          zoneId,
        },
      });
      return res.status(401).json({ error: "User not allowed" });
    }

    // Si el usuario pertenece a la zona, guardamos el acceso permitido en la base de datos y devolvemos el nombre del usuario
    await prisma.accessLog.create({
      data: {
        id: generateUuid(),
        userId: data,
        access: true,
        zoneId,
      },
    });

    res.status(200).json({ message: userToZone.User.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
