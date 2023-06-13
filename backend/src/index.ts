// Archivo principal del backend que contiene la configuración de la aplicación y las rutas de la API.
import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import authRouter from "./routes/authRouter";
import recognizerRouter from "./routes/recognizserRouter";
import userRouter from "./routes/userRouter";
import departmentRouter from "./routes/departmentRouter";
import zoneRouter from "./routes/zoneRouter";
import userToZoneRouter from "./routes/userToZoneRouter";
import accessLogsRouter from "./routes/accessLogsRouter";

// Inicializamos la aplicación
const app = express();

// Configuramos la aplicación para que pueda recibir peticiones de cualquier origen y para que pueda recibir datos en formato JSON y texto plano
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("ok");
});

// Configuramos las rutas de la API
app.use("/auth", authRouter);
app.use("/recognizer", recognizerRouter);
app.use("/user", userRouter);
app.use("/department", departmentRouter);
app.use("/zone", zoneRouter);
app.use("/user-to-zone", userToZoneRouter);
app.use("/access-logs", accessLogsRouter);

// Configuramos el puerto en el que escucha la aplicación
const port = process.env.PORT || 8007;

// Iniciamos la aplicación en el puerto configurado
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
