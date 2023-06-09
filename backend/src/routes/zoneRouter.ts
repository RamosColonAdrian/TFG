// Rutas para el controlador de zonas
import { Router } from "express";
import { getZonesController } from "../controllers/zone/getZonesController";
import { deleteZoneController } from "../controllers/zone/deleteZoneController";
import { updateZoneController } from "../controllers/zone/updateZoneController";
import { createZoneController } from "../controllers/zone/createZoneController";
import { getZoneController } from "../controllers/zone/getZoneController";
import { createZoneWithUsersController } from "../controllers/zone/createZoneWithUsersController";

const zoneRouter = Router();

zoneRouter.get("/", getZonesController);

zoneRouter.delete("/:id", deleteZoneController);

zoneRouter.put("/:id", updateZoneController);

zoneRouter.post("/", createZoneController);

zoneRouter.get("/:id", getZoneController);

zoneRouter.post("/with-users", createZoneWithUsersController);

export default zoneRouter;
