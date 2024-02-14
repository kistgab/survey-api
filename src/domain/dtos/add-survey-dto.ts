export interface InputAddSurveyDto {
  question: string;
  answers: {
    image: string;
    answer: string;
  }[];
}
