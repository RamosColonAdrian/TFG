import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient, User } from "@prisma/client";
import { hash, compare } from "bcryptjs";
import { v4 as generateUuid } from "uuid";
import prisma from "./db";
import checkThatEmailIsNotAlreadyRegistered from "./middlewares/checkThatEmailIsNotAlreadyRegistered";
import { sign, verify } from "jsonwebtoken";
import "dotenv/config";
import axios from "axios";
import Multer from "multer";
import FormData from "form-data";
import winston from "winston";
import { readFileSync } from "fs";
import * as path from "path";

const app = express();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs.log" }),
  ],
});

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

app.post("/register",
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

//TODO paginar 
app.get("/users", async (req, res) => {
  const { page = 1 } = req.query;
  const users = await prisma.user.findMany({
    skip: (+page - 1) * 10,
    take: 10,
  });

  res.status(200).json(users);
});

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id,
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

//leer registro de logs
app.get("/logs", async (req, res) => {
  const filePath = path.resolve(__dirname, "..", "logs.log");
  // Abrir el archivo de logs en modo lectura
  const fileContent = readFileSync(filePath, "utf8");

  // Separar el archivo en líneas
  const logsArray = fileContent.trim().split("\n");

  // Crear un nuevo array asociativo con los datos de cada línea
  const logsData = logsArray.map((logLine) => {
    const logObject: { [key: string]: any } = {};
    const logParts = logLine.trim().slice(1, -1).split(",");

    logParts.forEach((logPart) => {
      const [key, value] = logPart.split(":").map((part) => part.trim());
      logObject[key] = value;
    });

        return logObject;
  });
});


app.put("/user-photo/:id", multer.single("img"), async (req, res) => {
  const userId = req.params.id;
  const img = req.file;

  const formData = new FormData();
  formData.append("img", img?.buffer, {
    filename: img?.originalname,
    contentType: img?.mimetype,
  });

  formData.append("id", userId);


  try {
    await axios.post("http://localhost:8000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    res.status(200).json({ message: "Photo uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading photo");
  }
});










const port = process.env.PORT || 8007;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
