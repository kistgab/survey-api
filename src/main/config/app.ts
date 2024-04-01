import setupMiddlewares from "@src/main/config/middlewares";
import setupRoutes from "@src/main/config/routes";
import setupStaticFiles from "@src/main/config/static-files";
import { config } from "dotenv";
import express, { Express } from "express";

export function setupApp(): Express {
  config();
  const app = express();
  // setupSwagger(app);
  setupStaticFiles(app);
  setupMiddlewares(app);
  setupRoutes(app);
  return app;
}
