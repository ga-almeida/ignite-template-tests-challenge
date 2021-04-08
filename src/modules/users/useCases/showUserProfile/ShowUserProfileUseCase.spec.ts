import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let userTest: User;

describe("Show User Profile", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);

    userTest = await createUserUseCase.execute({
      email: "jhondoe@test.com.br",
      name: "Jhon Doe",
      password: "1234",
    });
  });

  it("should be able show user profile", async () => {
    const response = await showUserProfileUseCase.execute(userTest.id as string);

    expect(response.id).toBe(userTest.id);
  });

  it("should not be able show user profile id invalid", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("user_id_invalid");

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
