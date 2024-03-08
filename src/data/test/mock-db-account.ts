import { AccountModel } from "@src/data/models/account-model";
import AddAccountRepository from "@src/data/protocols/db/account/add-account-repository";
import FindAccountByEmailRepository from "@src/data/protocols/db/account/find-account-by-email-repository";
import FindAccountByTokenRepository from "@src/data/protocols/db/account/find-account-by-token-repository";
import UpdateAccessTokenRepository from "@src/data/protocols/db/account/update-access-token-repository";
import { mockAccountModel } from "@src/domain/test/mock-account";

export function mockAddAccountRepository(): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountRepositoryStub();
}

export function mockFindAccountByEmailRepository(): FindAccountByEmailRepository {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async findByEmail(): Promise<AccountModel | null> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new FindAccountByEmailRepositoryStub();
}

export function mockFindAccountByRepository(): FindAccountByTokenRepository {
  class FindAccountByRepositoryStub implements FindAccountByTokenRepository {
    async findByToken(): Promise<AccountModel | null> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new FindAccountByRepositoryStub();
}

export function mockUpdateAccessTokenRepository(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(): Promise<void> {
      return Promise.resolve();
    }
  }
  return new UpdateAccessTokenRepositoryStub();
}
