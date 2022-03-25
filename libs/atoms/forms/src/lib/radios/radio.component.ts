import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CoerceBoolean, Required } from '@grorg/decorators';
import { BooleanInput } from '@grorg/types';
import { CheckedChange } from './radios.models';
import { RadiosGroupComponent } from './radios-group.component';

@Component({
  selector: 'gro-radio',
  template: `<label>
    <input type="radio" [name]="name" [value]="value" [checked]="checked" [disabled]="disabled ?? null" />
    <ng-content></ng-content>
  </label>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent<ValueType> {
  static ngAcceptInputType_checked: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;

  @Input()
  public name!: string;

  @Input()
  @Required()
  public value!: ValueType;

  @Output()
  public readonly checkedChange: EventEmitter<CheckedChange<ValueType>> = new EventEmitter<CheckedChange<ValueType>>();

  constructor(private readonly _parent: RadiosGroupComponent<ValueType>) {}

  private _disabled = false;

  get disabled(): boolean {
    return this._disabled || this._parent.disabled;
  }

  @Input()
  @CoerceBoolean()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  private _checked = false;

  get checked(): boolean {
    return this._checked;
  }

  @Input()
  @CoerceBoolean()
  set checked(checked: boolean) {
    if (this._checked !== checked) {
      this._checked = checked;
      this.checkedChange.emit(new CheckedChange(this, false));
    }
  }

  @HostListener('click')
  public onClick(): void {
    if (!this.disabled) {
      this._checked = true;
      this.checkedChange.emit(new CheckedChange(this, true));
    }
  }
}
