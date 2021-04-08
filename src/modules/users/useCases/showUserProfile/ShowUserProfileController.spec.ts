import request from "supertest";
import { app } from "../../../../app";

import connection from '../../../../database';

let user_test: {
  name: string;
  email: string;
  password: string;
};

describe("Show User Profile", () => {
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

  it("should be able to show profile of user", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions").send({
        email: user_test.email,
        password: user_test.password,
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
  });

  it("should not be able show user profile id invalid", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions").send({
        email: "email_invalid",
        password: user_test.password,
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

      expect(response.status).toBe(401);
  });
});
