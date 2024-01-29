import { Express, Router } from "express";
import authenticationRoutes from "../routes/authentication-routes";

export default function setupRoutes(app: Express): void {
  const router = Router();
  app.use("/api", router);
  authenticationRoutes(router);
}
