import { setupApp } from "@src/main/config/app";
import { Express } from "express";
import request from "supertest";

let app: Express;

describe("Cors Middleware", () => {
  beforeEach(() => {
    app = setupApp();
  });

  it("should return content-type json as default", async () => {
    app.post("/content_type_test", (req, res) => {
      res.send("");
    });

    await request(app).post("/content_type_test").expect("content-type", /json/);
  });

  it("should return content-type xml when forced", async () => {
    app.post("/content_type_test_xml", (req, res) => {
      res.type("xml");
      res.send("");
    });

    await request(app).post("/content_type_test_xml").expect("content-type", /xml/);
  });
});
