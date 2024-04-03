export type InputAuthenticationDto = {
  email: string;
  password: string;
};

export type OutputAuthenticationDto = {
  accessToken: string;
  name: string;
};
