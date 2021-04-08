import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let userTest: User;
let statementTest: Statement;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

    userTest = await createUserUseCase.execute({
      email: "jhondoe@test.com.br",
      name: "Jhon Doe",
      password: "1234",
    });

    statementTest = await createStatementUseCase.execute({
      amount: 1000,
      description: "Salary",
      type: "deposit" as OperationType,
      user_id: userTest.id as string
    });
  });

  it("should be able to get statment operation", async () => {
    const response = await getStatementOperationUseCase.execute({
      statement_id: statementTest.id as string,
      user_id: userTest.id as string
    });

    expect(response.amount).toBe(1000);
    expect(response.description).toBe("Salary");
    expect(response.type).toBe("deposit");
    expect(response.user_id).toBe(userTest.id);
  });

  it("should not be able to get statment operation if user does not exists", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: statementTest.id as string,
        user_id: "user_invalid"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statment operation if statement does not exists", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: "statement_invalid",
        user_id: userTest.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
