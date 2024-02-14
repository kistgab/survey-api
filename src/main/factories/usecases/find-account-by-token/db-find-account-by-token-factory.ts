import DbFindAccountByToken from "../../../../data/usecases/account/find-account-by-token/db-find-account-by-token";
import FindAccountByToken from "../../../../domain/usecases/find-account-by-token";
import JwtAdapter from "../../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository";

export default abstract class DbFindAccountByTokenFactory {
  static create(): FindAccountByToken {
    const decrypter = new JwtAdapter(process.env.JWT_SECRET);
    const accountMongoRepository = new AccountMongoRepository();
    return new DbFindAccountByToken(decrypter, accountMongoRepository);
  }
}
