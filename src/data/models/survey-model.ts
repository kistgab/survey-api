interface Answer {
  image: string;
  answer: string;
}

export interface AddSurveyModel {
  question: string;
  answers: Answer[];
}
