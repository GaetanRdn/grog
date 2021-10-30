import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TemplateLookup } from '@grorg/tests';
import { SelectComponent, SelectModule } from './select.component';

describe('SelectComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, HostMultipleComponent],
      imports: [SelectModule],
    });
  });

  describe('Basic select', () => {
    let templateLookup: TemplateLookup<HostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup(TestBed.createComponent(HostComponent));
      templateLookup.detectChanges();
    });

    test.each`
      options                   | value
      ${[]}                     | ${null}
      ${['option1', 'option2']} | ${'option1'}
    `('should create with options', ({ options, value }) => {
      // GIVEN
      templateLookup.hostComponent.options = options;
      templateLookup.hostComponent.value = value;

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(SelectComponent).options).toEqual(options);
      expect(templateLookup.getComponent(SelectComponent).value).toEqual(value);
    });

    test('Open on click', () => {
      // WHEN
      openPanel();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('Close on click outside', () => {
      // GIVEN
      openPanel();

      // WHEN
      templateLookup.query('.outside').click();
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test.each([0, 1])(
      'when click on option %s then value is emitted and panel is closed',
      (index: number) => {
        // GIVEN
        const expectedOption: string =
          templateLookup.getComponent<SelectComponent<string>>(SelectComponent).options[index];
        openPanel();

        // WHEN
        templateLookup.queryAll('.gro-option')[index].click();
        templateLookup.detectChanges();

        // THEN
        expect(templateLookup.firstChildElement).toMatchSnapshot();
        expect(templateLookup.hostComponent.changedValue).toEqual(expectedOption);
        expect(templateLookup.getComponent(SelectComponent).value).toEqual(expectedOption);
      }
    );

    test('When required then cannot deselect option', () => {
      // GIVEN
      jest.spyOn(templateLookup.getComponent(SelectComponent).valueChange, 'emit');
      templateLookup.hostComponent.required = true;

      // WHEN
      toggleOption();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(SelectComponent).valueChange.emit).not.toBeCalled();
      expect(templateLookup.hostComponent.value).toEqual(templateLookup.hostComponent.options[0]);
    });

    test('When not required then can deselect option', () => {
      // GIVEN
      templateLookup.hostComponent.changedValue = templateLookup.hostComponent.options[0];

      // WHEN
      toggleOption();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.changedValue).toBeNull();
    });

    test('when disabled then cannot open panel', () => {
      // GIVEN
      templateLookup.hostComponent.disabled = true;
      templateLookup.detectChanges();

      // WHEN
      openPanel();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    function openPanel(): void {
      templateLookup.query('gro-select').click();
      templateLookup.detectChanges();
    }

    function toggleOption(): void {
      templateLookup.hostComponent.value = templateLookup.hostComponent.options[0];
      templateLookup.detectChanges();
      openPanel();

      templateLookup.queryAll('.gro-option')[0].click();
      templateLookup.detectChanges();
    }
  });

  describe('Multiple selection', () => {
    let templateLookup: TemplateLookup<HostMultipleComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup(TestBed.createComponent(HostMultipleComponent));
      templateLookup.detectChanges();
    });

    test('When multiple selection then emitted value', () => {
      // GIVEN
      openPanel();
      const optionElements: HTMLElement[] = templateLookup.queryAll('.gro-option');

      // WHEN
      optionElements[0].click();
      optionElements[1].click();
      templateLookup.detectChanges();
      openPanel();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.hostComponent.value).toEqual(['option1', 'option2']);
    });

    function openPanel(): void {
      templateLookup.query('gro-select').click();
      templateLookup.detectChanges();
    }
  });

  test.todo('Options');
  test.todo('Options groups');
  test.todo('Complex option value');
});

@Component({
  template: ` <gro-select
      [options]="options"
      [value]="value"
      [required]="required"
      (valueChange)="changedValue = $event"
      [disabled]="disabled"
    ></gro-select>
    <span class="outside"></span>`,
})
class HostComponent {
  public options: string[] = ['option1', 'option2'];

  public value: string | null = null;

  public changedValue: string | null = null;

  public required = false;

  public disabled = false;
}

@Component({
  template: ` <gro-select
      [options]="options"
      [value]="value"
      (valueChange)="changedValue = $event"
      multiple
    ></gro-select>
    <span class="outside"></span>`,
})
class HostMultipleComponent {
  public options: string[] = ['option1', 'option2', 'option3'];

  public value: string[] = [];

  public changedValue: string[] = [];
}
