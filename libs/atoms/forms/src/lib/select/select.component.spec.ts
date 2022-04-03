import { TestBed, waitForAsync } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TemplateLookup } from '@grorg/tests';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Nullable } from '@grorg/types';
import { OptionComponent } from '../option/option.component';

describe('Select', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectComponent, BasicSelectComponent, OptionComponent],
        imports: [NoopAnimationsModule],
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

    test('when initialized with value then check', () => {
      // WHEN
      templateLookup.hostComponent.value = 'Two';
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(SelectComponent).options.toArray()[1].selected).toBe(true);
    });
  });
});

@Component({
  template: ` <gro-select [placeholder]="placeholder" [(value)]="value">
      <gro-option>One</gro-option>
      <gro-option>Two</gro-option>
      <gro-option>Three</gro-option> </gro-select
    ><span class="click-out"></span>`,
})
class BasicSelectComponent {
  public placeholder = '';

  public value: Nullable<string> = null;
}
