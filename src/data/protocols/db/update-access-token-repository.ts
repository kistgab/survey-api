export default interface UpdateAccessTokenRepository {
  updateAccessToken(userId: string, token: string): Promise<void>;
}
