import adaptRoute from "@src/main/adapters/express-route-adapter";
import { LoadSurveyResultControllerFactory } from "@src/main/factories/controllers/survey-answer/load-survey-result-controller-factory";
import SurveyAnswerControllerFactory from "@src/main/factories/controllers/survey-answer/survey-answer-controller-factory";
import { auth } from "@src/main/middlewares/auth/auth";
import { Router } from "express";

export default function surveyAnswerRoutes(router: Router): void {
  router.put(
    "/surveys/:surveyId/answers",
    auth(),
    adaptRoute(SurveyAnswerControllerFactory.create()),
  );
  router.get(
    "/surveys/:surveyId/results",
    auth(),
    adaptRoute(LoadSurveyResultControllerFactory.create()),
  );
}
