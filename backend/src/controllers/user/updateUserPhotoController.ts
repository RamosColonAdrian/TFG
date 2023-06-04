import axios from "axios";
import prisma from "../../config/db";
import cloudinary from "../../../cloudinary_config";
import { Request, Response } from "express";

export const updateUserPhotoController = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const img = req.file;

  if (!img) {
    return res.status(400).json({ error: "No se proporcionó ninguna imagen" });
  }

  try {
    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "face_recognition",
          public_id: userId,
          overwrite: true,
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      stream.write(img.buffer);
      stream.end();
    });

    const picture = result.secure_url;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        picture,
      },
    });

    await axios.post(`${process.env.MODEL_URL}/reload-model`, {});

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
