import { TestBed, waitForAsync } from '@angular/core/testing';
import { OptionComponent } from './option.component';
import { Component, DebugElement } from '@angular/core';
import { TemplateLookup } from '@grorg/tests';

describe('OptionComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OptionComponent, WithoutValueComponent, WithValueComponent],
      }).compileComponents();
    })
  );

  describe('Without value', () => {
    let templateLookup: TemplateLookup<WithoutValueComponent>;

    beforeEach(() => (templateLookup = new TemplateLookup(WithoutValueComponent)));

    test('should create', () => {
      templateLookup.detectChanges();
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(OptionComponent).value).toEqual('Value');
    });

    test('should emit value on click', () => {
      // GIVEN
      jest.spyOn(templateLookup.hostComponent, 'selectedChange');
      templateLookup.detectChanges();

      // WHEN
      const debugElement: DebugElement = templateLookup.get('gro-option');
      debugElement.triggerEventHandler('click', { target: debugElement.nativeElement });

      // THEN
      expect(templateLookup.hostComponent.selectedChange).toBeCalledWith(debugElement.componentInstance);
    });

    test('should emit value once on click', () => {
      // GIVEN
      jest.spyOn(templateLookup.hostComponent, 'selectedChange');
      templateLookup.detectChanges();

      // WHEN
      const debugElement: DebugElement = templateLookup.get('gro-option');
      debugElement.triggerEventHandler('click', { target: debugElement.nativeElement });
      debugElement.triggerEventHandler('click', { target: debugElement.nativeElement });

      // THEN
      expect(templateLookup.hostComponent.selectedChange).toBeCalledTimes(1);
    });

    test('should have class gro-selected when selected', () => {
      templateLookup.detectChanges();

      // WHEN
      const debugElement: DebugElement = templateLookup.get('gro-option');
      debugElement.triggerEventHandler('click', { target: debugElement.nativeElement });
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should create disabled', () => {
      templateLookup.hostComponent.disabled = true;
      templateLookup.detectChanges();
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('cannot be selected if disabled', () => {
      // GIVEN
      jest.spyOn(templateLookup.hostComponent, 'selectedChange');
      templateLookup.hostComponent.disabled = true;
      templateLookup.detectChanges();

      // WHEN
      templateLookup.query('gro-option').click();

      // THEN
      expect(templateLookup.hostComponent.selectedChange).not.toBeCalled();
    });
  });

  describe('With value', () => {
    let templateLookup: TemplateLookup<WithValueComponent>;

    beforeEach(() => (templateLookup = new TemplateLookup(WithValueComponent)));

    test('should create', () => {
      templateLookup.detectChanges();
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(OptionComponent).value).toEqual('Val');
    });
  });
});

@Component({
  template: ` <gro-option (selectedChange)="selectedChange($event)" [disabled]="disabled">Value</gro-option>`,
})
class WithoutValueComponent {
  public disabled = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public selectedChange(_: OptionComponent<string>): void {
    // empty for testing
  }
}

@Component({
  template: ` <gro-option value="Val">Label</gro-option>`,
})
class WithValueComponent {}
