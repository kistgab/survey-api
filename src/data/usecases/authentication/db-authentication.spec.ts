import AccountModel from "../../models/account-model";
import FindAccountByEmailRepository from "../../protocols/find-account-by-email-repository";
import DbAuthentication from "./db-authentication";

describe("DbAuthentication UseCase", () => {
  it("should call FindAccountByEmailRepository with correct email", async () => {
    class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
      async find(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: "any_id",
          name: "any_name",
          email,
          password: "hashed_password",
        };
        return Promise.resolve(account);
      }
    }
    const findAccountByEmailRepositoryStub = new FindAccountByEmailRepositoryStub();
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, "find");

    const sut = new DbAuthentication(findAccountByEmailRepositoryStub);

    await sut.auth({
      email: "any_email@mail.com",
      password: "any_password",
    });

    expect(findSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
