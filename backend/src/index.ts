import express from "express";
import cors from "cors";
import morgan from "morgan";
import { v4 as generateUuid } from "uuid";
import prisma from "./config/db";
import "dotenv/config";
import axios from "axios";
import cloudinary from "../cloudinary_config";
import authRouter from "./routes/authRouter";
import recognizerRouter from "./routes/recognizserRouter";
import userRouter from "./routes/userRouter";
import departmentRouter from "./routes/departmentRouter";
import zoneRouter from "./routes/zoneRouter";
import userToZoneRouter from "./routes/userToZoneRouter";
import accessLogsRouter from "./routes/accessLogsRouter";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("ok");
});

app.use("/auth", authRouter);
app.use("/recognizer", recognizerRouter);
app.use("/user", userRouter);
app.use("/department", departmentRouter);
app.use("/zone", zoneRouter);
app.use("/user-to-zone", userToZoneRouter);
app.use("/access-logs", accessLogsRouter);

const port = process.env.PORT || 8007;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
