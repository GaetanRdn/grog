import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  NgModule,
  Output,
  Provider,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutoUnsubscribe, CoerceBoolean } from '@grorg/decorators';
import { BehaviorSubject, Observable } from 'rxjs';
import { OnChangeFn, OnTouchedFn } from '../core/reactive-forms';
import { InputDirective, InputModule } from '../input/input.directive';
import {
  CreateOptionFn,
  DisplayFn,
  IdentityFn,
  OpenOn,
} from './autocomplete.models';

const AUTOCOMPLETE_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AutocompleteComponent),
  multi: true,
};

@Component({
  selector: 'gro-autocomplete',
  // standalone: true,
  host: {
    '[class.gro-opened]': 'isOpen',
    '[class.gro-disabled]': 'disabled',
    '[attr.required]': 'required || null',
    '[attr.disabled]': 'disabled || null',
  },
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [AUTOCOMPLETE_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@AutoUnsubscribe()
export class AutocompleteComponent<ValueType> implements ControlValueAccessor {
  @Input()
  public value: ValueType | null = null;

  @Input()
  @CoerceBoolean()
  public required = false;

  @Input()
  public openOn: OpenOn = 'focus';

  @Input()
  @CoerceBoolean()
  public disabled?: boolean;

  @Output()
  public readonly valueChange: EventEmitter<ValueType | null> = new EventEmitter<ValueType | null>();

  @Input()
  public createOptionFn?: CreateOptionFn<ValueType>;

  @ViewChild(InputDirective, { static: true })
  private _input!: InputDirective;

  private _displayedValues$: BehaviorSubject<ValueType[]> = new BehaviorSubject<
    ValueType[]
  >(this.options);

  get displayedValues$(): Observable<ValueType[]> {
    return this._displayedValues$.asObservable();
  }

  private _options: ValueType[] = [];

  @Input()
  set options(options: ValueType[]) {
    this._options = (options || []).sort((a: ValueType, b: ValueType) =>
      this.displayOptionFn(a) < this.displayOptionFn(b) ? -1 : 1
    );

    this._displayedValues$.next(this._options);
  }

  get displayedValue(): string {
    return this.value !== null ? this.displayOptionFn(this.value) : '';
  }

  private _isOpen = false;

  get isOpen(): boolean {
    return this._isOpen;
  }

  constructor(
    private _elementRef: ElementRef,
    private _cdr: ChangeDetectorRef
  ) {}

  @Input()
  public displayOptionFn: DisplayFn<ValueType> = (option: ValueType): string =>
    option as unknown as string;

  @Input()
  public identityFn: IdentityFn<ValueType> = (value: ValueType): unknown =>
    value;

  public readonly trackByFn: TrackByFunction<ValueType> = (
    _: number,
    value: ValueType
  ) => this.identityFn(value);

  @HostListener('document:click', ['$event.target'])
  public onClick(event: EventTarget): void {
    if (!this._elementRef.nativeElement.contains(event)) {
      this._isOpen = false;
    }
  }

  public openPanel(): void {
    if (this.openOn === 'focus') {
      this._isOpen = true;
    }
  }

  public select(option: ValueType): void {
    if (
      this.value === null ||
      this.identityFn(this.value) !== this.identityFn(option)
    ) {
      this.propagateChange(option);
    } else if (!this.required) {
      this.propagateChange(null);
    }
  }

  public filterOptions(target: EventTarget | null): void {
    if (this.openOn === 'input' && !this.isOpen) {
      this._isOpen = true;
    }
    this._displayedValues$.next(
      this._options.filter((option: ValueType) =>
        this.displayOptionFn(option)
          .toLocaleLowerCase()
          .includes((target as HTMLInputElement).value.toLocaleLowerCase())
      )
    );
  }

  public isSelected(option: ValueType): boolean {
    return (
      this.value !== null &&
      this.identityFn(this.value) === this.identityFn(option)
    );
  }

  public writeValue(value: ValueType): void {
    this.value = value;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._cdr.markForCheck();
  }

  public registerOnChange(fn: OnChangeFn<ValueType>): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: OnTouchedFn): void {
    this._onTouched = fn;
  }

  public createOption(target: EventTarget | null): void {
    const value: string = (target as HTMLInputElement).value;

    if (
      typeof this.createOptionFn === 'function' &&
      value.length !== 0 &&
      this._displayedValues$.getValue().length === 0
    ) {
      this.propagateChange(this.createOptionFn(value));
    }
  }

  protected _onChange: OnChangeFn<ValueType> = (): void => {
    // default if no ngControl
  };

  protected _onTouched: OnTouchedFn = (): void => {
    // default if no ngControl
  };

  private propagateChange(value: ValueType | null): void {
    this.value = value;
    this._isOpen = false;
    this._onChange(this.value);
    this._onTouched();
    this.valueChange.emit(this.value);
  }
}

@NgModule({
  declarations: [AutocompleteComponent],
  exports: [AutocompleteComponent],
  imports: [CommonModule, InputModule],
})
export class AutocompleteModule {}
