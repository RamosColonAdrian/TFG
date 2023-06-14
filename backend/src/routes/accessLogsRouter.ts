// Ruta para el controlador de los logs de acceso
import { Router } from "express";
import { getAccessLogsController } from "../controllers/accessLog/getAccessLogsController";
import { deleteAccessLogsController } from "../controllers/accessLog/deleteAccessLogsController";

const accessLogsRouter = Router();

accessLogsRouter.get("/", getAccessLogsController);
accessLogsRouter.delete("/", deleteAccessLogsController);


export default accessLogsRouter;
