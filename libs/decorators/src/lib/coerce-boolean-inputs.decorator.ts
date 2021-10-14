export function CoerceBoolean() {
  return function(target: any, key: string, propertyDescriptor?: PropertyDescriptor): void {
    if (!!propertyDescriptor && !!propertyDescriptor.set) {
      const original = propertyDescriptor.set;

      propertyDescriptor.set = function(next) {
        original.apply(this, [next !== null && next !== undefined && `${next}` !== 'false']);
      }
    } else {
      coerceWithoutAccessors(target, key);
    }
  };

  function coerceWithoutAccessors(target: any, key: string): void {
    const getter = function() {
      // using Typescript reflection
      // @ts-ignore
      return this['__' + key];
    };

    const setter = function(next: any) {
      // using Typescript reflection
      // @ts-ignore
      this['__' + key] = next !== null && next !== undefined && `${next}` !== 'false';
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  }
}
