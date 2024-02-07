import request from "supertest";
import app from "../../config/app";

describe("Cors Middleware", () => {
  it("should enable cors", async () => {
    app.post("/cors_test", (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .get("/cors_test")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-headers", "*")
      .expect("access-control-allow-methods", "*");
  });
});
