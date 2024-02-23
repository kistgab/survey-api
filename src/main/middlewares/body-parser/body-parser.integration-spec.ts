import app from "@src/main/config/app";
import request from "supertest";

describe("BodyParser Middleware", () => {
  it("should parse body as json", async () => {
    app.post("/test_body_parser", (req, res) => {
      res.send(req.body);
    });
    const response = await request(app).post("/test_body_parser").send({ name: "any_name" });

    expect(response.body).toEqual({ name: "any_name" });
  });
});
