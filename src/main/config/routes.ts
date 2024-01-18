import { Express, Router } from "express";
import signupRoute from "../routes/signup-route";

export default function setupRoutes(app: Express): void {
  const router = Router();
  app.use("/api", router);
  signupRoute(router);
}
