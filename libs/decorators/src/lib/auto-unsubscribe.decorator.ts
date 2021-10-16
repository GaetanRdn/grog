/**
 * Allows to auto unsubscribe from Observables.
 *
 * Automatically check if a (_)subscriptions property exist (must be a Subscription[]), if yes then unsubscribe all.
 * Automatically check this properties, all one which are Observable and is not in the excludeProps is unsubscribe.
 *
 * @param excludeProps list of properties to exclude
 */
export function AutoUnsubscribe(excludeProps: string[] = []) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function(constructor: Function) {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function() {
      // Observable properties which are not excluded
      for (const prop in this) {
        if (!excludeProps.includes(prop) && typeof this[prop]?.unsubscribe === 'function') {
          this[prop].unsubscribe();
        }
      }

      if (original && typeof original === 'function') {
        original.apply(this);
      }
    };
  };
}
