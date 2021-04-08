import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let userTest: User;

describe("Authenticate User", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    userTest = await createUserUseCase.execute({
      email: "jhondoe@test.com.br",
      name: "Jhon Doe",
      password: "1234",
    });
  });

  it("should be able authenticate user", async () => {
    const response = await authenticateUserUseCase.execute({
      email: userTest.email,
      password: "1234",
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able authenticate user with email invalid", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "email-invalid",
        password: "1234",
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able authenticate user with password invalid", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: userTest.email,
        password: "password-invalid",
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
