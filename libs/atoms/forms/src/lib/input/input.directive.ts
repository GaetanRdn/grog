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
  SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoUnsubscribe, CoerceBoolean } from '@grorg/decorators';

@Directive({
  selector: 'input[groInput]',
  host: {
    class: 'gro-input',
    '[class.gro-focused]': 'focused || null',
    '[class.gro-readonly]': 'readonly || null',
    '[class.gro-disabled]': 'disabled || null'
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: InputDirective, multi: true }
  ]
})
@AutoUnsubscribe()
export class InputDirective implements ControlValueAccessor, OnChanges {
  static ngAcceptInputType_disabled: string | boolean | null | undefined;

  @HostBinding('attr.value')
  @Input()
  public value: any;

  @Input()
  @HostBinding('readonly')
  @CoerceBoolean()
  public readonly = false;

  @Output()
  public readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

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

  constructor(private _elementRef: ElementRef) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this._elementRef.nativeElement.value = this.value;
    }
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  @HostListener('input', ['$event.target.value'])
  public onInput(value: any): void {
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

  protected _onChange = (_: any): void => {
    // default if no ngControl
  };

  protected _onTouched = (): void => {
    // default if no ngControl
  };
}

@NgModule({
  declarations: [InputDirective],
  imports: [CommonModule],
  exports: [InputDirective]
})
export class InputModule {
}
