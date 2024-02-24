import adaptRoute from "@src/main/adapters/express-route-adapter";
import AddSurveyControllerFactory from "@src/main/factories/controllers/survey/add-survey/add-survey-controller-factory";
import ListSurveysControllerFactory from "@src/main/factories/controllers/survey/list-surveys/list-surveys-controller-factory";
import { adminAuth } from "@src/main/middlewares/auth/admin-auth";
import { auth } from "@src/main/middlewares/auth/auth";
import { Router } from "express";

export default function surveyRoutes(router: Router): void {
  router.post("/surveys", adminAuth(), adaptRoute(AddSurveyControllerFactory.create()));
  router.get("/surveys", auth(), adaptRoute(ListSurveysControllerFactory.create()));
}
