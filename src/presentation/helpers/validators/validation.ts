export default interface Validation {
  validate<T>(input: T): Error | null;
}
