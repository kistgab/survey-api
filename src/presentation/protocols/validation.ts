export default interface Validation<T = unknown> {
  validate(input: T): Error | undefined;
}
