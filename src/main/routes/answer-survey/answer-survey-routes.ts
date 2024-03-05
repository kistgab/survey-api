import adaptRoute from "@src/main/adapters/express-route-adapter";
import SurveyAnswerControllerFactory from "@src/main/factories/controllers/survey-answer/survey-answer-controller-factory";
import { auth } from "@src/main/middlewares/auth/auth";
import { Router } from "express";

export default function surveyAnswerRoutes(router: Router): void {
  router.put(
    "/surveys/:surveyId/answers",
    auth(),
    adaptRoute(SurveyAnswerControllerFactory.create()),
  );
}
