import {
  InputAuthenticationDto,
  OutputAuthenticationDto,
} from "@src/domain/dtos/authentication-dto";

export default interface Authentication {
  auth(input: InputAuthenticationDto): Promise<OutputAuthenticationDto | null>;
}
