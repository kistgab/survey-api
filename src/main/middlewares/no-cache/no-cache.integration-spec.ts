import { setupApp } from "@src/main/config/app";
import { noCache } from "@src/main/middlewares/no-cache/no-cache";
import request from "supertest";

describe("No Cache Middleware", () => {
  it("should enable no-cache", async () => {
    const app = setupApp();
    app.get("/test_no_cache", noCache, (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .get("/test_no_cache")
      .expect("cache-control", "no-store, no-cache, must-revalidate, proxy-revalidate")
      .expect("expires", "0")
      .expect("surrogate-control", "no-store");
  });
});
