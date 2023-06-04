import { Router } from "express";
import multer from "../config/multer";
import { getUsersController } from "../controllers/user/getUsersController";
import { updateUserPhotoController } from "../controllers/user/updateUserPhotoController";
import { getUserController } from "../controllers/user/getUserController";
import { updateUserController } from "../controllers/user/updateUserController";
import { deleteUserController } from "../controllers/user/deleteUserController";

const userRouter = Router();

userRouter.get("/", getUsersController);



userRouter.put("/photo/:id", multer.single("img"), updateUserPhotoController);

userRouter.get("/:id", getUserController);

userRouter.put("/:id", updateUserController);

userRouter.delete("/:id", deleteUserController);


export default userRouter;