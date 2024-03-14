import { SurveyAnswerModel } from "@src/data/models/save-survey-answer-model";
import { AddSurveyModel, SurveyModel } from "@src/data/models/survey-model";
import { SurveyResultModel } from "@src/data/models/survey-result-model";
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

export function mockSurveyResultModel(): SurveyResultModel {
  return {
    answers: [
      {
        answer: "any_answer",
        count: 1,
        percent: 100,
        image: "any_image",
      },
      {
        answer: "another_answer",
        count: 0,
        percent: 0,
        image: "another_image",
      },
    ],
    question: "valid_question",
    surveyId: "valid_survey_id",
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
    answers: [
      {
        answer: "any_answer",
        count: 1,
        percent: 100,
        image: "any_image",
      },
      {
        answer: "another_answer",
        count: 0,
        percent: 0,
        image: "another_image",
      },
    ],
    question: "valid_question",
    surveyId: "valid_survey_id",
    date: new Date(),
  };
}

export function mockAddSurveyModel(): AddSurveyModel {
  return {
    question: "any_question",
    answers: [
      {
        image: "any_image",
        answer: "any_answer",
      },
    ],
    date: new Date(),
  };
}
