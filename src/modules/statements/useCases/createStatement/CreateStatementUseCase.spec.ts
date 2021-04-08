import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let userTest: User;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    userTest = await createUserUseCase.execute({
      email: "jhondoe@test.com.br",
      name: "Jhon Doe",
      password: "1234",
    });
  });

  it("should be able to create statment", async () => {
    const response = await createStatementUseCase.execute({
      amount: 1000,
      description: "Salary",
      type: "deposit" as OperationType,
      user_id: userTest.id as string
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create statment of a user that does not exist", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 1000,
        description: "Salary",
        type: "deposit" as OperationType,
        user_id: "user_invalid"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create statment withdraw if the balance is insufficient", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 1000,
        description: "Buy shopping",
        type: "withdraw" as OperationType,
        user_id: userTest.id as string
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
