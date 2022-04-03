import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgModule,
  NgZone,
  Output,
  QueryList,
} from '@angular/core';
import { OptionComponent, OptionModule } from '../option/option.component';
import { MaterialIconModule } from '@grorg/atoms/icons';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { defer, merge, Observable } from 'rxjs';
import { startWith, switchMap, take, tap } from 'rxjs/operators';
import { Nullable } from '@grorg/types';

// TODO handle multiple selection
// TODO handle Complex type selection
// TODO revoir la bordure en selected

@Component({
  selector: 'gro-select',
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [style({ height: 0 }), animate(300)]),
      transition(':leave', [animate(300, style({ height: 0 }))]),
    ]),
  ],
  template: ` <div class="gro-select-wrapper">
      <span>{{ viewValue }}</span>
      <gro-material-icon>expand_more</gro-material-icon>
    </div>
    <div class="gro-options-wrapper" [style.height.rem]="panelHeight" *ngIf="opened" @slideDownUp>
      <ng-content></ng-content>
    </div>`,
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<ValueType> implements AfterContentInit {
  @Input()
  public placeholder?: string;

  @Input()
  public value: Nullable<ValueType> = null;

  @Output()
  public readonly valueChange: EventEmitter<Nullable<ValueType>> = new EventEmitter<Nullable<ValueType>>();

  @ContentChildren(OptionComponent)
  public readonly options!: QueryList<OptionComponent<ValueType>>;

  @HostBinding('class.gro-opened')
  public opened = false;
  private readonly _selectionChange$: Observable<OptionComponent<ValueType>> = defer(() => {
    const options = this.options;

    if (options) {
      return options.changes.pipe(
        startWith(options),
        switchMap(() => merge(...options.map((option) => option.selectedChange)))
      );
    }

    return this._ngZone.onStable.pipe(
      take(1),
      switchMap(() => this._selectionChange$)
    );
  });

  constructor(
    private readonly _elementRef: ElementRef,
    private readonly _ngZone: NgZone,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  private _viewValue: Nullable<string> = null;

  get viewValue(): string {
    return this._viewValue ?? this.placeholder ?? '';
  }

  get panelHeight(): number {
    return this.options.toArray().length * 4;
  }

  @HostListener('click')
  public openPanel(): void {
    this.opened = true;
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(event: EventTarget): void {
    if (!this._elementRef.nativeElement.contains(event)) {
      this.opened = false;
    }
  }

  public ngAfterContentInit(): void {
    this._selectionChange$
      .pipe(
        tap((option: OptionComponent<ValueType>) =>
          this.options
            .toArray()
            .filter((opt: OptionComponent<ValueType>) => opt !== option)
            .forEach((opt: OptionComponent<ValueType>) => (opt.selected = false))
        ),
        tap(() => (this.opened = false)),
        tap((option: OptionComponent<ValueType>) => (this._viewValue = option.value as unknown as string)),
        tap((option: OptionComponent<ValueType>) => (this.value = option.value)),
        tap(() => this.valueChange.emit(this.value))
      )
      .subscribe(() => this._cdr.markForCheck());

    if (this.value) {
      this._viewValue = this.value as unknown as string;
      const found: OptionComponent<ValueType> | undefined = this.options.find(
        (option: OptionComponent<ValueType>) => option.value === this.value
      );

      if (found) {
        found.selected = true;
      }
    }
  }
}

@NgModule({
  declarations: [SelectComponent],
  exports: [SelectComponent, OptionModule],
  imports: [MaterialIconModule, CommonModule],
})
export class SelectModule {}
