type SurveyAnswerModel = {
  image?: string;
  answer: string;
};

export type AddSurveyModel = {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
};

export type SurveyModel = {
  id: string;
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
  didAnswer?: boolean;
};
