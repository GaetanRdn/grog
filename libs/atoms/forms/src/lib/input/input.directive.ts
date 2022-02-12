import { CommonModule } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  OnChanges,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoUnsubscribe, CoerceBoolean } from '@grorg/decorators';
import { BooleanInput, NgChanges, Nullable } from '@grorg/types';
import { OnChangeFn, OnTouchedFn } from '../core/reactive-forms.models';

@Directive({
  selector: 'input[groInput]',
  host: {
    class: 'gro-input',
    '[class.gro-focused]': 'focused || null',
    '[class.gro-readonly]': 'readonly || null',
    '[class.gro-disabled]': 'disabled || null',
    '[attr.value]': 'value',
    '[attr.readonly]': 'readonly || null',
    '[disabled]': 'disabled || null',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: InputDirective, multi: true },
  ],
})
@AutoUnsubscribe()
export class InputDirective implements ControlValueAccessor, OnChanges {
  static ngAcceptInputType_disabled: BooleanInput;

  @Input()
  public value = '';

  @Input()
  @CoerceBoolean()
  public readonly = false;

  @Output()
  public readonly valueChange: EventEmitter<InputDirective['value']> =
    new EventEmitter<InputDirective['value']>();

  @Input()
  @CoerceBoolean()
  public disabled = false;

  private _focused = false;

  get focused(): boolean {
    return this._focused;
  }

  constructor(private readonly _elementRef: ElementRef<HTMLInputElement>) {}

  public ngOnChanges(changes: NgChanges<InputDirective>): void {
    if (changes.value) {
      this._elementRef.nativeElement.value = this.value;
    }
  }

  public writeValue(value: Nullable<InputDirective['value']>): void {
    this.value = value ?? '';
  }

  public registerOnChange(
    fn: OnChangeFn<Nullable<InputDirective['value']>>
  ): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  @HostListener('input', ['$event.target.value'])
  public onInput(value: string): void {
    if (!this.readonly && !this.disabled) {
      this.value = value;
      this.valueChange.emit(value);
      this.onChange(value);
      this.onTouched();
    }
  }

  @HostListener('focus', ['true'])
  @HostListener('blur', ['false'])
  public onToggleFocus(focused: boolean): void {
    if (!this.readonly && !this.disabled) {
      this._focused = focused;
      this.onTouched();
    }
  }

  public onChange: OnChangeFn<Nullable<InputDirective['value']>> = (): void => {
    // default if no ngControl
  };

  public onTouched: OnTouchedFn = (): void => {
    // default if no ngControl
  };
}

@NgModule({
  declarations: [InputDirective],
  imports: [CommonModule],
  exports: [InputDirective],
})
export class InputModule {}
