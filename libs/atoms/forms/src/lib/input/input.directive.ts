import { CommonModule } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgModule,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoUnsubscribe, CoerceBoolean } from '@grorg/decorators';
import { OnChangeFn, OnTouchedFn } from '../core/reactive-forms';

@Directive({
  selector: 'input[groInput]',
  host: {
    class: 'gro-input',
    '[class.gro-focused]': 'focused || null',
    '[class.gro-readonly]': 'readonly || null',
    '[class.gro-disabled]': 'disabled || null',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: InputDirective, multi: true },
  ],
})
@AutoUnsubscribe()
export class InputDirective<ValueType>
  implements ControlValueAccessor, OnChanges
{
  static ngAcceptInputType_disabled: string | boolean | null | undefined;

  @HostBinding('attr.value')
  @Input()
  public value: ValueType | null = null;

  @Input()
  @HostBinding('readonly')
  @CoerceBoolean()
  public readonly = false;

  @Output()
  public readonly valueChange: EventEmitter<ValueType | null> = new EventEmitter<ValueType | null>();

  private _disabled = false;

  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  @HostBinding('disabled')
  @CoerceBoolean()
  set disabled(disabled) {
    this._disabled = disabled;
  }

  private _focused = false;

  get focused(): boolean {
    return this._focused;
  }

  constructor(private _elementRef: ElementRef) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this._elementRef.nativeElement.value = this.value;
    }
  }

  public writeValue(value: ValueType | null): void {
    this.value = value;
  }

  public registerOnChange(fn: OnChangeFn<ValueType>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this._onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  @HostListener('input', ['$event.target.value'])
  public onInput(value: ValueType | null): void {
    if (!this.readonly && !this.disabled) {
      this.value = value;
      this.valueChange.emit(value);
      this._onChange(value);
      this._onTouched();
    }
  }

  @HostListener('focus', ['true'])
  @HostListener('blur', ['false'])
  public onToggleFocus(focused: boolean): void {
    if (!this.readonly && !this.disabled) {
      this._focused = focused;
      this._onTouched();
    }
  }

  protected _onChange: OnChangeFn<ValueType> = (): void => {
    // default if no ngControl
  };

  protected _onTouched: OnTouchedFn = (): void => {
    // default if no ngControl
  };
}

@NgModule({
  declarations: [InputDirective],
  imports: [CommonModule],
  exports: [InputDirective],
})
export class InputModule {}
