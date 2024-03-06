import DbFindAccountByToken from "@src/data/usecases/account/find-account-by-token/db-find-account-by-token";
import FindAccountByToken from "@src/domain/usecases/account/find-account-by-token";
import JwtAdapter from "@src/infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "@src/infra/db/mongodb/account/account-mongo-repository";

export default abstract class DbFindAccountByTokenFactory {
  static create(): FindAccountByToken {
    const decrypter = new JwtAdapter(process.env.JWT_SECRET);
    const accountMongoRepository = new AccountMongoRepository();
    return new DbFindAccountByToken(decrypter, accountMongoRepository);
  }
}
