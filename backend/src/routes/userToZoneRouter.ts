// Rutas para el controlador de usuarios a zonas
import { Router } from "express";
import { createUserToZoneController } from "../controllers/userToZone/createUserToZoneController";
import { getUserToZoneController } from "../controllers/userToZone/getUserToZoneController";
import { deleteUserToZoneController } from "../controllers/userToZone/deleteUserToZoneController";

const userToZoneRouter = Router();

userToZoneRouter.post("/", createUserToZoneController);

userToZoneRouter.get("/:userId", getUserToZoneController);

userToZoneRouter.delete("/:id", deleteUserToZoneController);

export default userToZoneRouter;
