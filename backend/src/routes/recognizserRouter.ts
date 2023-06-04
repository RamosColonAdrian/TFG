import { Router } from "express";
import multer from "../config/multer";
import { recognizeFaceController } from "../controllers/recognizer/recognizeFaceController";

const recogniterRouter = Router();

recogniterRouter.post("/", multer.single("img"), recognizeFaceController);

export default recogniterRouter;
