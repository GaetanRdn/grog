import { ControlValueAccessor } from '@angular/forms';
import { Nullable } from '@grorg/types';

export interface TypedControlValueAccessor<ValueType> extends ControlValueAccessor {
  writeValue(value: Nullable<ValueType>): void;

  registerOnChange(fn: OnChangeFn<ValueType>): void;

  registerOnTouched(fn: OnTouchedFn): void;
}

export type OnChangeFn<ValueType> = (value: Nullable<ValueType>) => void;

export type OnTouchedFn = () => void;
