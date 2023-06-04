import { Router } from "express";
import checkThatEmailIsNotAlreadyRegistered from "../middlewares/checkThatEmailIsNotAlreadyRegistered";
import { registerController } from "../controllers/auth/registerController";
import { loginController } from "../controllers/auth/loginController";

const authRouter = Router();

authRouter.post(
  "/register",
  checkThatEmailIsNotAlreadyRegistered,
  registerController
);

authRouter.post("/login", loginController);

export default authRouter;
