export type InputAnswerSurveyDto = {
  surveyId: string;
  accountId: string;
  date: Date;
  answer: string;
};

export type OutputAnswerSurveyDto = {
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
