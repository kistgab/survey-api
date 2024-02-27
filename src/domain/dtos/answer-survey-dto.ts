export type InputAnswerSurveyDto = {
  surveyId: string;
  accountId: string;
  date: Date;
  answer: string;
};

export type OutputAnswerSurveyDto = {
  id: string;
  surveyId: string;
  accountId: string;
  date: Date;
  answer: string;
};
