import { Express, Router } from "express";
import authenticationRoutes from "../routes/authentication/authentication-routes";
import surveyRoutes from "../routes/survey/survey-routes";

export default function setupRoutes(app: Express): void {
  const router = Router();
  app.use("/api", router);
  authenticationRoutes(router);
  surveyRoutes(router);
}
