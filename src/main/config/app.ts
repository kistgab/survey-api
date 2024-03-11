import setupMiddlewares from "@src/main/config/middlewares";
import setupRoutes from "@src/main/config/routes";
import * as dotenv from "dotenv";
import express, { Express } from "express";

export function setupApp(): Express {
  dotenv.config();
  const app = express();
  // setupSwagger(app);
  setupMiddlewares(app);
  setupRoutes(app);
  return app;
}
