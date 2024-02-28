import { InputAuthenticationDto } from "@src/domain/dtos/authentication-dto";

export default interface Authentication {
  auth(input: InputAuthenticationDto): Promise<string | null>;
}
