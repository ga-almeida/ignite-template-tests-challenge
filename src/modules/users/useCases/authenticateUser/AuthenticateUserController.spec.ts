import request from "supertest";
import { app } from "../../../../app";

import connection from '../../../../database';

let user_test: {
  name: string;
  email: string;
  password: string;
};

describe("Authenticate User", () => {
  beforeAll(async ()=>{
    await connection.create();

    user_test = {
      email: "jhondoe@test.com.br",
      name: "Jhon Doe",
      password: "1234",
    }

    await request(app).post("/api/v1/users").send(user_test);
  });

  afterAll(async ()=>{
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  it("should be able to authenticate user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: user_test.email,
      password: user_test.password,
    });

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate user does not exists", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "email_invalid",
      password: user_test.password,
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate user password invalid", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: user_test.email,
      password: "password_invalid",
    });

    expect(response.status).toBe(401);
  });
});
