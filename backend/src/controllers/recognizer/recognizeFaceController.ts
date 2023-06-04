import { Request, Response } from "express";
import axios from "axios";
import prisma from "../../config/db";
import { v4 as generateUuid } from "uuid";
import FormData from "form-data";

export const recognizeFaceController = async (req: Request, res: Response) => {
  const img = req.file;
  const { zoneId } = req.body as { zoneId: string; };

  const formData = new FormData();
  formData.append("img", img?.buffer, {
    filename: img?.originalname,
    contentType: img?.mimetype,
  });

  try {
    const { data } = await axios.post(
      "http://localhost:8000/classify",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data === "Desconocido") {
      return res.send({ message: data });
    }

    const userToZone = await prisma.userToZone.findFirst({
      where: {
        userId: data,
        zoneId,
      },
      include: {
        User: true,
      },
    });

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
