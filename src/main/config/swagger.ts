import { swaggerConfig } from "@src/main/docs";
import { noCache } from "@src/main/middlewares/no-cache/no-cache";
import { Express } from "express";
import { serve, setup } from "swagger-ui-express";

export function setupSwagger(app: Express): void {
  app.use("/api", noCache, serve, setup(swaggerConfig));
}
