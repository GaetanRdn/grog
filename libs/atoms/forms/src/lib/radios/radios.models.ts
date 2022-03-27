import { RadioComponent } from './radio.component';

export class CheckedChange<ValueType> {
  constructor(public readonly source: RadioComponent<ValueType>, public readonly isUserInteraction = false) {}
}
