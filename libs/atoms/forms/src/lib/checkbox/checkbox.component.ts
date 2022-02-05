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
import { Nullable } from '@grorg/types';
import { OnChangeFn, OnTouchedFn } from '../core/reactive-forms.models';

@Component({
  selector: 'gro-checkbox',
  // s
  host: {
    '[attr.checked]': 'checked || null',
    '[attr.readonly]': 'readOnly || null',
    '[attr.disabled]': 'disabled || null',
    '[class.gro-checked]': 'checked || null',
    '[class.gro-readonly]': 'readOnly || null',
    '[class.gro-disabled]': 'disabled || null',
  },
  template: `<input
      type="checkbox"
      [value]="value"
      [readOnly]="readOnly || null"
      [disabled]="disabled || null"
      [checked]="checked || null"
    />
    <span class="gro-checkbox-label"><ng-content></ng-content></span>`,
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
  public value: Nullable<ValueType> = null;

  @Input()
  @CoerceBoolean()
  public checked = false;

  @Input()
  @CoerceBoolean()
  public readOnly = false;

  @Input()
  @CoerceBoolean()
  public disabled = false;

  @Output()
  public readonly valueChange: EventEmitter<
    CheckboxComponent<ValueType>['value']
  > = new EventEmitter<CheckboxComponent<ValueType>['value']>();

  constructor(private readonly _cdr: ChangeDetectorRef) {}

  public writeValue(obj: CheckboxComponent<ValueType>['value']): void {
    this.checked = obj !== null && obj !== undefined;
  }

  public registerOnChange(fn: OnChangeFn<ValueType>): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdr.markForCheck();
  }

  /**
   * @internal private usage
   */
  @HostListener('click')
  public onToggle(): void {
    if (!this.readOnly && !this.disabled) {
      this.onTouched();
      this.checked = !this.checked;
      const emittedValue: CheckboxComponent<ValueType>['value'] = this.checked
        ? this.value
        : null;
      this.valueChange.emit(emittedValue);
      this.onChange(emittedValue);
    }
  }

  public onChange: OnChangeFn<ValueType> = (): void => {
    // default if no ngControl
  };

  public onTouched: () => void = (): void => {
    // default if no ngControl
  };
}

@NgModule({
  declarations: [CheckboxComponent],
  exports: [CheckboxComponent],
  imports: [CommonModule],
})
export class CheckboxModule {}
