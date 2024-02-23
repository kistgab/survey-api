import { bodyParser } from "@src/main/middlewares/body-parser/body-parser";
import { contentType } from "@src/main/middlewares/content-type/content-type";
import { cors } from "@src/main/middlewares/cors/cors";
import { Express } from "express";

export default function setupMiddlewares(app: Express): void {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
}
