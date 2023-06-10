import { compare } from "bcryptjs";
import prisma from "../../config/db";
import { User } from "@prisma/client";
import { loginController } from "./loginController";

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("../../config/db", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "testToken"),
  verify: jest.fn(),
}));

describe("Given login controller", () => {
  describe("When it is called with valid credentials", () => {
    test("should return a 200 status and user data with token", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        sendStatus: jest.fn(),
      } as any;

      const req = {
        headers: {
          authorization: undefined,
        },
        body: {
          email: "testemail@gmail.com",
          password: "testPass",
        },
      } as any;

      const existingUser: User | null = {
        id: "testId",
        email: "testemail@gmail.com",
        hashedPassword: "hashedPass",
        name: "testName",
        surname: "testSurname",
        dni: null,
        birthDate: null,
        registerDate: null,
        address: null,
        phone: null,
        relativeName: null,
        relativePhone: null,
        role: null,
        type: null,
        picture: null,
        departmentId: null,
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (compare as jest.Mock).mockResolvedValue(true);

      await loginController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: "testId",
          email: "testemail@gmail.com",
          name: "testName",
          surname: "testSurname",
          address: null,
          birthDate: null,
          createdAt: expect.any(Date),
          departmentId: null,
          dni: null,
          phone: null,
          picture: null,
          registerDate: null,
          relativeName: null,
          relativePhone: null,
          role: null,
          type: null,
          updatedAt: expect.any(Date),
        },
        token: "testToken",
      });


    });
  });
});
