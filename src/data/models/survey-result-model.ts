export type SurveyResultModel = {
  surveyId: string;
  question: string;
  date: Date;
  answers: SurveyResultAnswerModel[];
};

type SurveyResultAnswerModel = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
};
