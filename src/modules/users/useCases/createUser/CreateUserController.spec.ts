import request from "supertest";
import { app } from "../../../../app";

import connection from '../../../../database';

describe("Create User", () => {
  beforeAll(async ()=>{
    await connection.create();
  });

  afterAll(async ()=>{
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users")
      .send({
        email: "jhondoe@test.com.br",
        name: "Jhon Doe",
        password: "1234",
      });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with same email", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        email: "jhondoe@test.com.br",
        name: "Jhon Doe",
        password: "1234",
      });

    const response = await request(app)
      .post("/api/v1/users")
      .send({
        email: "jhondoe@test.com.br",
        name: "Jhon Doe",
        password: "1234",
      });

    expect(response.status).toBe(400);
  });
});
