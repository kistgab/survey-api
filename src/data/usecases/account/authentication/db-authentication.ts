import Encrypter from "@src/data/protocols/cryptography/encrypter";
import HashComparer from "@src/data/protocols/cryptography/hash-comparer";
import FindAccountByEmailRepository from "@src/data/protocols/db/account/find-account-by-email-repository";
import UpdateAccessTokenRepository from "@src/data/protocols/db/account/update-access-token-repository";
import {
  InputAuthenticationDto,
  OutputAuthenticationDto,
} from "@src/domain/dtos/authentication-dto";
import Authentication from "@src/domain/usecases/account/authentication";

export default class DbAuthentication implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(input: InputAuthenticationDto): Promise<OutputAuthenticationDto | null> {
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
    return { accessToken, name: foundAccount.name };
  }
}
