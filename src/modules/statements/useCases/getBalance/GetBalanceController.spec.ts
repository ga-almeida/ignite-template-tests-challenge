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

describe("Get Balance", () => {
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

  it("should be able to get balance", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "jhondoe@test.com.br",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200);
  });

  it("should not be able to get balance non-existing user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user_invalid",
      password: "1234",
    });

    const { token } = responseToken.body;

    const response = await request(app)
    .get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(401);
  });
});
