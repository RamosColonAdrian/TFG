import { Router } from "express";
import { compare, hash } from "bcryptjs";
import { createUseerToZoneController } from "../controllers/userToZone/createUseerToZoneController";
import { getUserToZoneController } from "../controllers/userToZone/getUserToZoneController";
import { deleteUserToZoneController } from "../controllers/userToZone/deleteUserToZoneController";

const userToZoneRouter = Router();

userToZoneRouter.post("/", createUseerToZoneController);

userToZoneRouter.get("/:userId", getUserToZoneController);

userToZoneRouter.delete("/:id", deleteUserToZoneController);

export default userToZoneRouter;
