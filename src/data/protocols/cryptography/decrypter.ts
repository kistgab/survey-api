export default interface Decrypter {
  decrypt(hash: string): Promise<string | null>;
}
