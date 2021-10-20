import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoUnsubscribe, CoerceBoolean } from '@grorg/decorators';
import { OnChangeFn, OnTouchedFn } from '../core/reactive-forms';

@Component({
  selector: 'gro-checkbox',
  // s
  host: {
    '[attr.checked]': 'checked || null',
    '[attr.readonly]': 'readOnly || null',
    '[attr.disabled]': 'disabled || null',
    '[class.adr-checked]': 'checked || null',
    '[class.adr-readonly]': 'readOnly || null',
    '[class.adr-disabled]': 'disabled || null',
  },
  template: `<input
      type="checkbox"
      [value]="value"
      [readOnly]="readOnly || null"
      [disabled]="disabled || null"
      [checked]="checked || null"
    />
    <span class="adr-checkbox-label"><ng-content></ng-content></span>`,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: CheckboxComponent, multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@AutoUnsubscribe()
export class CheckboxComponent<ValueType> implements ControlValueAccessor {
  // TIPS: HTMLInputElement.indeterminate = true;

  @Input()
  @HostBinding('attr.value')
  public value: ValueType | null = null;

  @Input()
  @CoerceBoolean()
  public checked?: boolean;

  @Input()
  @CoerceBoolean()
  public readOnly?: boolean;

  @Input()
  @CoerceBoolean()
  public disabled?: boolean;

  @Output()
  public readonly valueChange: EventEmitter<ValueType | null> = new EventEmitter<ValueType | null>();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  public writeValue(obj: ValueType): void {
    this.checked = obj !== null && obj !== undefined;
  }

  public registerOnChange(fn: OnChangeFn<ValueType>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @internal private usage
   */
  @HostListener('click')
  public onChange(): void {
    if (!this.readOnly && !this.disabled) {
      this._onTouched();
      this.checked = !this.checked;
      const emittedValue: ValueType | null = this.checked ? this.value : null;
      this.valueChange.emit(emittedValue);
      this._onChange(emittedValue);
    }
  }

  protected _onChange: OnChangeFn<ValueType> = (): void => {
    // default if no ngControl
  };

  protected _onTouched: () => void = (): void => {
    // default if no ngControl
  };
}

@NgModule({
  declarations: [CheckboxComponent],
  exports: [CheckboxComponent],
  imports: [CommonModule],
})
export class CheckboxModule {}
