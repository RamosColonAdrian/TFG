import { Router } from "express";
import { getAccessLogsController } from "../controllers/accessLog/getAccessLogsController";

const accessLogsRouter = Router();

accessLogsRouter.get("/", getAccessLogsController);

export default accessLogsRouter;
