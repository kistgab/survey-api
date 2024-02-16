interface SurveyAnswerModel {
  image?: string;
  answer: string;
}

export interface AddSurveyModel {
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}

export interface SurveyModel {
  id: string;
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
}
