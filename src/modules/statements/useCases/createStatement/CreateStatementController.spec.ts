import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from '../../../../database';

let connection: Connection;

let user_test: {
  email: string;
  name: string;
  password: string;
};

describe("Create Statement", () => {
  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();

    user_test = {
      email: "jhondoe@test.com.br",
      name: "Jhon Doe",
      password: "1234",
    }

    await request(app).post("/api/v1/users").send(user_test);
  });

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to deposit", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "jhondoe@test.com.br",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Salary"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201);
  });

  it("should be able to withdraw", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "jhondoe@test.com.br",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: "Buy shopping"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create statement with non-existing user", async () => {
    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 100,
      description: "Buy shopping"
    }).set({
      Authorization: `Bearer ${"token_invalid"}`
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to withdraw no have founds", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "jhondoe@test.com.br",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 200,
      description: "Buy shopping"
    }).set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(400);
  });
});
