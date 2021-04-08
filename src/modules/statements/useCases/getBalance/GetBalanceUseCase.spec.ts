import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get balance", async () => {
    const user = await createUserUseCase.execute({
      email: "jhondoe@test.com.br",
      name: "Jhon Doe",
      password: "1234",
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(response).toHaveProperty("balance");
  });

  it("should not be able to obtain the balance of a user that does not exist", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user_invalid"
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
