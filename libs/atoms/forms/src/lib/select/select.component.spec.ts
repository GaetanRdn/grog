import { TestBed, waitForAsync } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TemplateLookup } from '@grorg/tests';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Nullable } from '@grorg/types';
import { OptionComponent } from '../option/option.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

describe('Select', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectComponent, BasicSelectComponent, OptionComponent, ReactiveSelectComponent],
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

      templateLookup.query('gro-select').click();
      templateLookup.detectChanges();

      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should close options on click out', () => {
      templateLookup.detectChanges();
      templateLookup.query('gro-select').click();
      templateLookup.detectChanges();
      expect(templateLookup.query('.gro-options-wrapper')).toBeTruthy();

      templateLookup.query('.click-out').click();
      templateLookup.detectChanges();

      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('when select option then check', () => {
      // GIVEN
      templateLookup.detectChanges();
      templateLookup.query('gro-select').click();
      templateLookup.detectChanges();

      // WHEN
      templateLookup.query('gro-option').click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.value).toEqual('One');
    });

    test('should create with initial value', () => {
      // WHEN
      templateLookup.hostComponent.value = 'Two';
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(SelectComponent).options.toArray()[1].selected).toBe(true);
    });

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
      templateLookup.query('gro-select').click();
      templateLookup.detectChanges();

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

    test('should create with initial control value', () => {
      templateLookup.hostComponent.control.setValue('Three');
      templateLookup.detectChanges();

      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(SelectComponent).viewValue).toEqual('Three');
      expect(templateLookup.getComponent(SelectComponent).options.toArray()[2].selected).toBe(true);
    });

    test('should update control value on option selection', () => {
      templateLookup.detectChanges();

      templateLookup.query('gro-select').click();
      templateLookup.detectChanges();
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
