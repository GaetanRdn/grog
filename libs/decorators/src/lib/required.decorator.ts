export function Required() {
  return function (target: any, key: string): void {
    const NG_ON_INIT = 'ngOnInit';

    // eslint-disable-next-line @typescript-eslint/ban-types
    const original: Function | null = target[NG_ON_INIT];

    target[NG_ON_INIT] = function () {
      if (this[key] === undefined) {
        throw new Error(`Property ${key} is required`);
      }

      if (original) {
        original.apply(this);
      }
    };
  };
}
