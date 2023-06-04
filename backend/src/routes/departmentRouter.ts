import e, { Router } from "express";
import checkThatEmailIsNotAlreadyRegistered from "../middlewares/checkThatEmailIsNotAlreadyRegistered";
import { compare, hash } from "bcryptjs";
import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import { getAllDepartmentsController } from "../controllers/department/getAllDepartmentsController";
import { createDepartmentWithUsersController } from "../controllers/department/createDepartmentWithUsersController";
import { getDepartmentWithUsersController } from "../controllers/department/getDepartmentWithUsersController";
import { updateDepartmentController } from "../controllers/department/updateDepartmentController";

const departmentRouter = Router();

departmentRouter.get("/", getAllDepartmentsController);

departmentRouter.post("/", createDepartmentWithUsersController);

departmentRouter.get("/:id", getDepartmentWithUsersController);

departmentRouter.put("/:id", updateDepartmentController);

export default departmentRouter;
