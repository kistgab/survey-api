import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import AddSurveyControllerFactory from "../../factories/controllers/survey/add-survey/add-survey-controller-factory";
import ListSurveysControllerFactory from "../../factories/controllers/survey/list-surveys/list-surveys-controller-factory";
import { auth } from "../../middlewares/auth/auth";
import { adminAuth } from "./../../middlewares/auth/admin-auth";

export default function surveyRoutes(router: Router): void {
  router.post("/surveys", adminAuth(), adaptRoute(AddSurveyControllerFactory.create()));
  router.get("/surveys", auth(), adaptRoute(ListSurveysControllerFactory.create()));
}
