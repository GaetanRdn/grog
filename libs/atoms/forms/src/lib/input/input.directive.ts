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
  selector: 'input[adrInput]',
  host: {
    class: 'adr-input',
    '[class.adr-focused]': 'focused || null',
    '[class.adr-readonly]': 'readonly || null',
    '[class.adr-disabled]': 'disabled || null'
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
  public readonly: boolean = false;

  @Output()
  public readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  private _disabled: boolean = false;

  get disabled(): boolean {
    return this._disabled;
  }

  @Input()
  @HostBinding('disabled')
  @CoerceBoolean()
  set disabled(disabled) {
    this._disabled = disabled;
  }

  private _focused: boolean = false;

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
  };

  protected _onTouched = (): void => {
  };
}

@NgModule({
  declarations: [InputDirective],
  imports: [CommonModule],
  exports: [InputDirective]
})
export class InputModule {
}
