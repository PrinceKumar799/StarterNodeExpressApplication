const request = require("supertest");
const app = require("../../app");

describe("user routes", () => {
  let userBody1 = {
    userName: "test",
    email: "test@testmail.com",
    password: "test",
    roles: [4294],
  };
  let accessToken = "";

  it("should return hello", async () => {
    const res = await request(app).get("/hello");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("msg");
  });

  // it("should create new user", async () => {
  //   const res = await request(app).post("/signup").send(userBody1);
  //   console.log(res.body);
  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty("message");
  //   expect(res.body.message).toBe("Registerd Successfully");
  // });

  it("should not create new user", async () => {
    const res = await request(app).post("/signup").send(userBody1);
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User already exists");
  });

  it("Should login user", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: userBody1.email, password: userBody1.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    accessToken = res.body.accessToken;
  });

  it("Should not login user", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "testing@email.com", password: userBody1.password });
    expect(res.status).toBe(400);
  });

  it("Should update user password", async () => {
    const res = await request(app)
      .post("/update")
      .set("authorization", `Bearer ${accessToken}`)
      .send({ email: userBody1.email, password: "newPass" });
    console.log(accessToken);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("msg");
    expect(res.body.msg).toBe("password updated");
  });

  it("Should not update user password no token", async () => {
    const res = await request(app).patch("/update").send({
      email: userBody1.email,
      password: "newPass",
    });
    expect(res.status).toBe(404);
  });

  // it("Should not update user password user not found", async () => {
  //   const res = (await request(app).post('/update')).send({ email: userBody1.email, password: "newPass" });
  //   expect(res.status).toBe(404);
  // })
});
