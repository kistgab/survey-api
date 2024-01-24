import { InputAuthenticationDto } from "../dtos/authentication-dto";

export default interface Authentication {
  auth(input: InputAuthenticationDto): Promise<string | null>;
}
