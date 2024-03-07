import { SurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { SurveyModel } from "@src/data/models/survey-model";
import { InputAddSurveyDto } from "@src/domain/dtos/add-survey-dto";
import { InputAnswerSurveyDto, OutputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";

export function mockInputAddSurveyDto(): InputAddSurveyDto {
  return {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
  };
}

export function mockSurveyModel(): SurveyModel {
  return {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
    id: "any_id",
  };
}

export function mockSurveyModelList(): SurveyModel[] {
  return [
    {
      question: "any_question",
      answers: [
        {
          image: "any_image",
          answer: "any_answer",
        },
      ],
      date: new Date(),
      id: "any_id",
    },
    {
      question: "any_other_question",
      answers: [
        {
          image: "any_other_image",
          answer: "any_other_answer",
        },
      ],
      date: new Date(),
      id: "any_other_id",
    },
  ];
}

export function mockSurveyAnswerModel(): SurveyAnswerModel {
  return {
    id: "valid_id",
    accountId: "valid_account_id",
    surveyId: "valid_survey_id",
    answer: "valid_answer",
    date: new Date(),
  };
}

export function mockInputAnswerSurveyDto(): InputAnswerSurveyDto {
  return {
    accountId: "valid_account_id",
    surveyId: "valid_survey_id",
    answer: "valid_answer",
    date: new Date(),
  };
}

export function mockOutputSurveyAnswerDto(): OutputAnswerSurveyDto {
  return {
    id: "any_id",
    surveyId: "any_survey_id",
    accountId: "any_account_id",
    date: new Date(),
    answer: "any_answer",
  };
}
