import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
} from '@angular/core';
import { AutoUnsubscribe, CoerceBoolean, Required } from '@grorg/decorators';
import { BooleanInput, EqualsFn, Nullable } from '@grorg/types';
import { defer, merge, Observable, Subscription } from 'rxjs';
import { startWith, switchMap, take } from 'rxjs/operators';
import { RadioComponent } from './radio.component';
import { CheckedChange } from './radios.models';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { OnChangeFn, OnTouchedFn } from '../core/reactive-forms.models';

@Component({
  selector: 'gro-radios-group',
  host: {
    '[class.gro-vertical]': 'vertical || null',
    '[class.gro-disabled]': 'disabled || null',
  },
  template: ` <ng-content></ng-content>`,
  styleUrls: ['./radios-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@AutoUnsubscribe()
export class RadiosGroupComponent<ValueType> implements AfterContentInit, OnInit, ControlValueAccessor {
  static ngAcceptInputType_vertical: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;

  @Input()
  @Required()
  public name!: string;

  @Input()
  public value: Nullable<ValueType> = null;

  @Input()
  @CoerceBoolean()
  public vertical = false;

  @Output()
  public readonly valueChange: EventEmitter<ValueType> = new EventEmitter<ValueType>();

  @ContentChildren(forwardRef(() => RadioComponent), { descendants: true })
  public readonly radios!: QueryList<RadioComponent<ValueType>>;

  private readonly _checkedChange: Observable<CheckedChange<ValueType>> = defer(() => {
    if (this.radios) {
      return this.radios.changes.pipe(
        startWith(this.radios),
        switchMap(() => merge(...this.radios.map((radio: RadioComponent<ValueType>) => radio.checkedChange)))
      );
    }

    return this._ngZone.onStable.pipe(
      take(1),
      switchMap(() => this._checkedChange)
    );
  });
  private _subscriptions: Subscription[] = [];

  constructor(private readonly _ngZone: NgZone, @Self() @Optional() private readonly _ngControl?: NgControl) {
    if (_ngControl) {
      _ngControl.valueAccessor = this;
    }
  }

  private _disabled = false;

  get disabled(): boolean {
    return this._disabled || Boolean(this._ngControl?.disabled);
  }

  @Input()
  @CoerceBoolean()
  set disabled(disabled: boolean) {
    this._disabled = disabled;
  }

  public ngOnInit(): void {
    this._subscriptions[this._subscriptions.length] = this._checkedChange.subscribe(
      (change: CheckedChange<ValueType>) => {
        this.value = change.source.value;

        if (change.isUserInteraction) {
          this._onChanged(this.value);
          this._onTouched();
          this.valueChange.emit(this.value);
        }
      }
    );
  }

  @Input()
  public equalsFn: EqualsFn<ValueType> = (value1: Nullable<ValueType>, value2: Nullable<ValueType>) =>
    value1 === value2;

  public ngAfterContentInit(): void {
    this._subscriptions[this._subscriptions.length] = this.radios.changes
      .pipe(startWith(this.radios))
      .subscribe((radios: QueryList<RadioComponent<ValueType>>) => {
        this.setRadioNames(radios);

        if (this.value !== null) {
          const found: RadioComponent<ValueType> | undefined = radios
            .toArray()
            .find((radio: RadioComponent<ValueType>) => this.equalsFn(radio.value, this.value));

          if (found && !found.checked) {
            found.checked = true;
          }
        } else {
          const checked: RadioComponent<ValueType> | undefined = radios
            .toArray()
            .find((radio: RadioComponent<ValueType>) => radio.checked);

          if (checked) {
            Promise.resolve().then(() => {
              this.value = checked.value;
              this.valueChange.emit(this.value);
            });
          }
        }
      });
  }

  public registerOnChange(fn: OnChangeFn<ValueType>): void {
    this._onChanged = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this._onTouched = fn;
  }

  public writeValue(value: RadiosGroupComponent<ValueType>['value']): void {
    if (!this.equalsFn(this.value, value)) {
      this.value = value;
    }
  }

  private _onTouched: OnTouchedFn = () => ({});

  private _onChanged: OnChangeFn<ValueType> = () => ({});

  private setRadioNames(radios: QueryList<RadioComponent<ValueType>>): void {
    radios.toArray().forEach((radio: RadioComponent<ValueType>) => (radio.name = this.name));
  }
}
