import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";

import createConnection from '../../../../database';

let connection: Connection;

let user_test: {
  email: string;
  name: string;
  password: string;
};

describe("Get Statement Operation", () => {
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

  it("should be able to get statement operation", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "jhondoe@test.com.br",
      password: "1234",
    });

    const { token } = responseToken.body;

    const responseStatement = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Salary"
    }).set({
      Authorization: `Bearer ${token}`
    });

    const response = await request(app)
    .get(`/api/v1/statements/${responseStatement.body.id}`)
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
  });

  it("should not be able to get statement operation non-existing user", async () => {
    await request(app).post("/api/v1/sessions").send({
      email: "user_invalid",
      password: "1234",
    });

    const response = await request(app)
    .get(`/api/v1/statements/${"id_invalid"}`)
    .set({
      Authorization: `Bearer ${"token_invalid"}`
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to get statement operation non-existing statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "jhondoe@test.com.br",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .get(`/api/v1/statements/${uuidV4()}`)
    .set({
      Authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(404);
  });
});
