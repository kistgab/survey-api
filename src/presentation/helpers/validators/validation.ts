export default interface Validation<T> {
  validate(input: T): Error | undefined;
}
