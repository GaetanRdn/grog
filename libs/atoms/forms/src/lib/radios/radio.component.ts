import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CoerceBoolean, Required } from '@grorg/decorators';
import { BooleanInput } from '@grorg/types';
import { CheckedChange } from './radios.models';

@Component({
  selector: 'gro-radio',
  template: `<label>
    <input type="radio" [name]="name" [value]="value" [checked]="checked" />
    <ng-content></ng-content>
  </label>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent<ValueType> {
  static ngAcceptInputType_checked: BooleanInput;

  @Input()
  public name!: string;

  @Input()
  @Required()
  public value!: ValueType;

  @Output()
  public readonly checkedChange: EventEmitter<CheckedChange<ValueType>> = new EventEmitter<CheckedChange<ValueType>>();

  private _checked = false;

  get checked(): boolean {
    return this._checked;
  }

  @Input()
  @CoerceBoolean()
  set checked(checked: boolean) {
    const wasChecked = this._checked;
    this._checked = checked;

    if (wasChecked !== checked) {
      this.checkedChange.emit(new CheckedChange(this, false));
    }
  }

  @HostListener('click')
  public onClick(): void {
    this._checked = true;
    this.checkedChange.emit(new CheckedChange(this, true));
  }
}
