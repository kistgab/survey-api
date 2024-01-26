import { InputAuthenticationDto } from "../../../domain/dtos/authentication-dto";
import Authentication from "../../../domain/usecases/authentication";
import Encrypter from "../../protocols/cryptography/encrypter";
import HashComparer from "../../protocols/cryptography/hash-comparer";
import FindAccountByEmailRepository from "../../protocols/db/account/find-account-by-email-repository";
import UpdateAccessTokenRepository from "../../protocols/db/account/update-access-token-repository";

export default class DbAuthentication implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(input: InputAuthenticationDto): Promise<string | null> {
    const foundAccount = await this.findAccountByEmailRepository.findByEmail(input.email);
    if (!foundAccount) {
      return null;
    }
    const areSamePassword = await this.hashComparer.compare(input.password, foundAccount.password);
    if (!areSamePassword) {
      return null;
    }
    const accessToken = await this.encrypter.encrypt(foundAccount.id);
    await this.updateAccessTokenRepository.updateAccessToken(foundAccount.id, accessToken);
    return accessToken;
  }
}
