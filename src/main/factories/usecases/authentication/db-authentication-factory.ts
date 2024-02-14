import DbAuthentication from "../../../../data/usecases/account/authentication/db-authentication";
import Authentication from "../../../../domain/usecases/authentication";
import BCryptAdapter from "../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";
import JwtAdapter from "../../../../infra/cryptography/jwt-adapter/jwt-adapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account/account-mongo-repository";

export default abstract class DbAuthenticationFactory {
  static create(): Authentication {
    const accountMongoRepository = new AccountMongoRepository();
    const bCryptComparer = new BCryptAdapter(12);
    const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET);
    const dbAuthentication = new DbAuthentication(
      accountMongoRepository,
      bCryptComparer,
      jwtAdapter,
      accountMongoRepository,
    );
    return dbAuthentication;
  }
}
