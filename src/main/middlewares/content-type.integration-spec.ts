import request from "supertest";
import app from "../config/app";

describe("Cors Middleware", () => {
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
