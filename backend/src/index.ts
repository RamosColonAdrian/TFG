import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

const port = process.env.PORT || 8007

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
