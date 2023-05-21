import express from "express";
import cors from "cors";
import morgan from "morgan";
import { User } from "@prisma/client";
import { hash, compare } from "bcryptjs";
import { v4 as generateUuid } from "uuid";
import prisma from "./db";
import checkThatEmailIsNotAlreadyRegistered from "./middlewares/checkThatEmailIsNotAlreadyRegistered";
import { sign, verify } from "jsonwebtoken";
import "dotenv/config";
import axios from "axios";
import Multer from "multer";
import FormData from "form-data";
import cloudinary from "../cloudinary_config";

const app = express();



app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const multer = Multer({
  storage: Multer.memoryStorage(),
});

// health check
app.get("/", (req, res) => {
  res.send("ok");
});

app.post(
  "/register",
  checkThatEmailIsNotAlreadyRegistered,
  async (req, res) => {
    const { email, password, name, surname } = req.body as {
      email: string;
      password: string;
      name: string;
      surname: string;
    };

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        id: generateUuid(),
        email,
        hashedPassword,
        name,
        surname,
      },
    });
    res.sendStatus(201);
  }
);

app.post("/login", async (req, res) => {
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
});

app.post("/recognizer", multer.single("img"), async (req, res) => {
  const img = req.file;

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

    //TODO: cambiar el id de la zona
    await prisma.accessLog.create({
      data: {
        id: generateUuid(),
        userId: data,
        access: true,
        zoneId: "467f16fe-2115-4924-8225-09b964937efb",
      },
    });

    res.status(200).json({ message: data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/users", async (req, res) => {
  const { page = 1 } = req.query;
  const users = await prisma.user.findMany({
    skip: (+page - 1) * 10,
    take: 10,
    include: {
      Department: true,
    },
  });

  res.status(200).json(users);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      Department: true,
      AccessLog: true,
    },
  });
  res.status(200).json(user);
});

app.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  try {
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
});

app.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
});

app.put("/user-photo/:id", multer.single("img"), async (req, res) => {
  const userId = req.params.id;
  const img = req.file;

  console.log(img);
  console.log(userId);

  if (!img) {
    return res.status(400).json({ error: "No se proporcionó ninguna imagen" });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "face_recognition",
          public_id: userId,
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      // Piping the buffer to the upload stream
      stream.write(img.buffer);
      stream.end();

    });

    console.log(result);

    // Aquí puedes realizar cualquier acción adicional con el resultado de la subida, como guardar la URL de la imagen en una base de datos, etc.

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/user-photo/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await cloudinary.api.resource(userId+".jpg");
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


app.get("/departments", async (req, res) => {
  const departments = await prisma.department.findMany({});

  res.status(200).json(departments);
});



const port = process.env.PORT || 8007;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
