export function ImplementStaticInterface<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
