import { setupApp } from "@src/main/config/app";
import request from "supertest";

describe("Cors Middleware", () => {
  it("should enable cors", async () => {
    const app = setupApp();
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
