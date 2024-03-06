export type SaveSurveyAnswerModel = {
  surveyId: string;
  accountId: string;
  date: Date;
  answer: string;
};

export type SurveyAnswerModel = {
  id: string;
  surveyId: string;
  accountId: string;
  date: Date;
  answer: string;
};
