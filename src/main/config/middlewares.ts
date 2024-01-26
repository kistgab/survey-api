import { Express } from "express";
import { bodyParser } from "../factories/middlewares/body-parser/body-parser";
import { contentType } from "../factories/middlewares/content-type/content-type";
import { cors } from "../factories/middlewares/cors/cors";

export default function setupMiddlewares(app: Express): void {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
}
