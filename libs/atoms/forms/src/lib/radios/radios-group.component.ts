import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  QueryList,
} from '@angular/core';
import { AutoUnsubscribe, CoerceBoolean, Required } from '@grorg/decorators';
import { BooleanInput, EqualsFn, Nullable } from '@grorg/types';
import { defer, merge, Observable, Subscription } from 'rxjs';
import { startWith, switchMap, take } from 'rxjs/operators';
import { RadioComponent } from './radio.component';
import { CheckedChange } from './radios.models';

@Component({
  selector: 'gro-radios-group',
  host: {
    '[class.gro-vertical]': 'vertical || null',
  },
  template: ` <ng-content></ng-content>`,
  styleUrls: ['./radios-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@AutoUnsubscribe()
export class RadiosGroupComponent<ValueType> implements AfterContentInit, OnInit {
  static ngAcceptInputType_vertical: BooleanInput;

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

  @ContentChildren(RadioComponent, { descendants: true })
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

  constructor(private readonly _ngZone: NgZone) {}

  public ngOnInit(): void {
    this._subscriptions[this._subscriptions.length] = this._checkedChange.subscribe(
      (change: CheckedChange<ValueType>) => {
        this.value = change.source.value;

        if (change.isUserInteraction) {
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

  private setRadioNames(radios: QueryList<RadioComponent<ValueType>>): void {
    radios.toArray().forEach((radio: RadioComponent<ValueType>) => (radio.name = this.name));
  }
}
