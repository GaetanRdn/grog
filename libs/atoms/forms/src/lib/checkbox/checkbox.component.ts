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
export class CheckboxComponent<T> implements ControlValueAccessor {
  // TIPS: HTMLInputElement.indeterminate = true;

  @Input()
  @HostBinding('attr.value')
  public value: T | null = null;

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
  public readonly valueChange: EventEmitter<T | null> = new EventEmitter<T | null>();

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  public writeValue(obj: T): void {
    this.checked = obj !== null && obj !== undefined;
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

  protected _onChange: (_: any) => void = (_: any): void => {
    // default if no ngControl
  };

  protected _onTouched: () => void = (): void => {
    // default if no ngControl
  };

  /**
   * @internal private usage
   */
  @HostListener('click')
  public onChange(): void {
    if (!this.readOnly && !this.disabled) {
      this._onTouched();
      this.checked = !this.checked;
      const emittedValue: T | null = this.checked ? this.value : null;
      this.valueChange.emit(emittedValue);
      this._onChange(emittedValue);
    }
  }
}

@NgModule({
  declarations: [CheckboxComponent],
  exports: [CheckboxComponent],
  imports: [CommonModule],
})
export class CheckboxModule {}
