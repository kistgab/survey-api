import { InputAuthenticationDto } from "../../../domain/dtos/authentication-dto";
import Authentication from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/cryptography/hash-comparer";
import FindAccountByEmailRepository from "../../protocols/db/find-account-by-email-repository";

export default class DbAuthentication implements Authentication {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
  ) {}

  async auth(input: InputAuthenticationDto): Promise<string | null> {
    const foundAccount = await this.findAccountByEmailRepository.find(input.email);
    if (!foundAccount) {
      return null;
    }
    await this.hashComparer.compare(input.password, foundAccount.password);
    return null;
  }
}
