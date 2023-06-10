import { registerController } from "./registerController";

jest.mock("bcryptjs", () => ({
  hash: () => "hashedPass",
}));

const mockCreate = jest.fn();

jest.mock("../../config/db", () => ({
  user: {
    create: (params: any) => mockCreate(params),
  },
}));

jest.mock("uuid", () => ({
  v4: () => "testUID",
}));

describe("Given register controller", () => {
  describe("When it is called whit valid body", () => {
    test("should return a 201 status", async () => {
      const res = {
        sendStatus: jest.fn(),
      } as any;

      const req = {
        body: {
          email: "testemail@gmail.com",
          password: "testPass",
          name: "testName",
          surname: "testSurname",
        },
      } as any;

      await registerController(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(201);
    });

    test("should called prisma.user.create", async () => {
      const res = {
        sendStatus: jest.fn(),
      } as any;

      const req = {
        body: {
          email: "testemail@gmail.com",
          password: "testPass",
          name: "testName",
          surname: "testSurname",
        },
      } as any;

      await registerController(req, res);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          email: "testemail@gmail.com",
          hashedPassword: "hashedPass",
          id: "testUID",
          name: "testName",
          picture:
            "https://res.cloudinary.com/dqrqizfkt/image/upload/v1685816526/default/default_user.png",
          surname: "testSurname",
        },
      });
    });
  });
});
