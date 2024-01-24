import { InputAuthenticationDto } from "../../../domain/dtos/authentication-dto";
import Authentication from "../../../domain/usecases/authentication";
import FindAccountByEmailRepository from "../../protocols/db/find-account-by-email-repository";

export default class DbAuthentication implements Authentication {
  constructor(private readonly findAccountByEmailRepository: FindAccountByEmailRepository) {}

  async auth(input: InputAuthenticationDto): Promise<string | null> {
    await this.findAccountByEmailRepository.find(input.email);
    return null;
  }
}
