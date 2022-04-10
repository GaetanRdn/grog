import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TemplateLookup } from '@grorg/tests';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EqualsFn, Nullable } from '@grorg/types';
import { OptionComponent } from '../option/option.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

describe('Select', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          SelectComponent,
          BasicSelectComponent,
          OptionComponent,
          ReactiveSelectComponent,
          ComplexSelectComponent,
        ],
        imports: [NoopAnimationsModule, ReactiveFormsModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  describe('Basic', () => {
    let templateLookup: TemplateLookup<BasicSelectComponent>;

    beforeEach(() => (templateLookup = new TemplateLookup(BasicSelectComponent)));

    test('should create', () => {
      templateLookup.detectChanges();
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should create with placeholder', () => {
      templateLookup.hostComponent.placeholder = 'Select';
      templateLookup.detectChanges();
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should open options on click', () => {
      templateLookup.detectChanges();

      openPanel(templateLookup);

      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should close options on click out', () => {
      templateLookup.detectChanges();
      openPanel(templateLookup);
      expect(templateLookup.query('.gro-options-wrapper')).toBeTruthy();

      templateLookup.query('.click-out').click();
      templateLookup.detectChanges();

      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when select option then check', () => {
      // GIVEN
      templateLookup.detectChanges();
      openPanel(templateLookup);

      // WHEN
      templateLookup.query('gro-option').click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.value).toEqual('One');
    });

    test('should create with initial value', fakeAsync(() => {
      // WHEN
      templateLookup.hostComponent.value = 'Two';
      templateLookup.detectChanges();
      tick(50);

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(SelectComponent).options.toArray()[1].selected).toBe(true);
    }));

    test('should be disabled', () => {
      // WHEN
      templateLookup.hostComponent.disabled = true;
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should not opened options panel on click if disabled', () => {
      // GIVEN
      templateLookup.hostComponent.disabled = true;
      templateLookup.detectChanges();

      // WHEN
      openPanel(templateLookup);

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });

  describe('Reactive', () => {
    let templateLookup: TemplateLookup<ReactiveSelectComponent>;

    beforeEach(() => (templateLookup = new TemplateLookup(ReactiveSelectComponent)));

    test('should create', () => {
      templateLookup.detectChanges();
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should create with initial control value', fakeAsync(() => {
      templateLookup.hostComponent.control.setValue('Three');
      templateLookup.detectChanges();
      tick(50);

      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(SelectComponent).viewValue).toEqual('Three');
      expect(templateLookup.getComponent(SelectComponent).options.toArray()[2].selected).toBe(true);
    }));

    test('should update control value on option selection', () => {
      templateLookup.detectChanges();

      openPanel(templateLookup);
      templateLookup.query('gro-option').click();
      templateLookup.detectChanges();

      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.control.value).toEqual('One');
    });

    test('should be disabled', () => {
      // WHEN
      templateLookup.hostComponent.control.disable();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });

  describe('Complex value', () => {
    let templateLookup: TemplateLookup<ComplexSelectComponent>;

    beforeEach(() => (templateLookup = new TemplateLookup(ComplexSelectComponent)));

    test('should create', () => {
      templateLookup.detectChanges();
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should create with initial value', () => {
      templateLookup.hostComponent.value = { value: 2, label: 'Two', toString: () => 'Two' };
      templateLookup.detectChanges();
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when select option then check', () => {
      // GIVEN
      templateLookup.detectChanges();
      openPanel(templateLookup);

      // WHEN
      templateLookup.query('gro-option').click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(
        templateLookup.getComponent(SelectComponent).equals(templateLookup.hostComponent.value, {
          value: 1,
          label: 'One',
          toString: () => 'One',
        })
      ).toBe(true);
    });
  });

  function openPanel(templateLookup: TemplateLookup<unknown>): void {
    templateLookup.query('gro-select').click();
    templateLookup.detectChanges();
  }
});

@Component({
  template: ` <gro-select [placeholder]="placeholder" [(value)]="value" [disabled]="disabled">
      <gro-option>One</gro-option>
      <gro-option>Two</gro-option>
      <gro-option>Three</gro-option> </gro-select
    ><span class="click-out"></span>`,
})
class BasicSelectComponent {
  public placeholder = '';

  public value: Nullable<string> = null;

  public disabled = false;
}

@Component({
  template: ` <gro-select [(value)]="value" [equals]="equals">
      <gro-option *ngFor="let option of options" [value]="option">{{ option.label }}</gro-option> </gro-select
    ><span class="click-out"></span>`,
})
class ComplexSelectComponent {
  public readonly options = [
    { value: 1, label: 'One', toString: () => 'One' },
    { value: 2, label: 'Two', toString: () => 'Two' },
    { value: 3, label: 'Three', toString: () => 'Three' },
  ] as const;

  public value: Nullable<{ value: number; label: string; toString: () => string }> = null;

  public readonly equals: EqualsFn<{ value: number; label: string; toString: () => string }> = (val1, val2) =>
    val1?.value === val2?.value;
}

@Component({
  template: ` <gro-select [placeholder]="placeholder" [formControl]="control">
      <gro-option>One</gro-option>
      <gro-option>Two</gro-option>
      <gro-option>Three</gro-option> </gro-select
    ><span class="click-out"></span>`,
})
class ReactiveSelectComponent {
  public placeholder = '';

  public control: FormControl = new FormControl();
}
