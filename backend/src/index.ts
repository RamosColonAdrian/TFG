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
      console.log("token is not valid");
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

app.post("/getPhoto", multer.single("img"), async (req, res) => {
  const  img  = req.file ;
  console.log(img);

  const formData = new FormData();
  formData.append("img", img?.buffer, { 
    filename: img?.originalname,
    contentType: img?.mimetype
  });
  
  const { data } = await axios.post(
    "http://localhost:8000/classify",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  res.status(200).json({ message: data });  
});



const port = process.env.PORT || 8007;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
