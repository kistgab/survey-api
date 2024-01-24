import { InputAuthenticationDto } from "../../../domain/dtos/authentication-dto";
import AccountModel from "../../models/account-model";
import FindAccountByEmailRepository from "../../protocols/find-account-by-email-repository";
import DbAuthentication from "./db-authentication";

function createFakeAccount(): AccountModel {
  return {
    id: "any_id",
    name: "any_name",
    email: "any_email@mail.com",
    password: "hashed_password",
  };
}

function createFindAccountByEmailRepository(): FindAccountByEmailRepository {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async find(): Promise<AccountModel> {
      return Promise.resolve(createFakeAccount());
    }
  }
  return new FindAccountByEmailRepositoryStub();
}

function createFakeInputDto(): InputAuthenticationDto {
  return {
    email: "any_email@mail.com",
    password: "any_password",
  };
}

type SutTypes = {
  sut: DbAuthentication;
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository;
};

function createSut(): SutTypes {
  const findAccountByEmailRepositoryStub = createFindAccountByEmailRepository();
  const sut = new DbAuthentication(findAccountByEmailRepositoryStub);
  return {
    sut,
    findAccountByEmailRepositoryStub,
  };
}

describe("DbAuthentication UseCase", () => {
  it("should call FindAccountByEmailRepository with correct email", async () => {
    const { sut, findAccountByEmailRepositoryStub } = createSut();
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, "find");

    await sut.auth(createFakeInputDto());

    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
