import surveyAnswerRoutes from "@src/main/routes/answer-survey/answer-survey-routes";
import authenticationRoutes from "@src/main/routes/authentication/authentication-routes";
import surveyRoutes from "@src/main/routes/survey/survey-routes";
import { Express, Router } from "express";

export default function setupRoutes(app: Express): void {
  const router = Router();
  app.use("/api", router);
  authenticationRoutes(router);
  surveyRoutes(router);
  surveyAnswerRoutes(router);
}
