import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TemplateLookup } from '@grorg/tests';
import { EqualsFn, Nullable } from '@grorg/types';
import { RadiosGroupComponent } from './radios-group.component';
import { RadiosModule } from './radios.module';

describe('RadiosGroupComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HostComponent, HostWithoutEqualsFnComponent],
        imports: [RadiosModule],
      }).compileComponents();
    })
  );

  describe('Complex Object', () => {
    let templateLookup: TemplateLookup<HostComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup(TestBed.createComponent(HostComponent));
      jest.spyOn(templateLookup.hostComponent, 'valueChange');
    });

    test('should create', () => {
      templateLookup.detectChanges();

      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });

    test('should create with initial value', () => {
      templateLookup.hostComponent.value = { id: 2, name: 'no' };

      templateLookup.detectChanges();

      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.queryAll<HTMLInputElement>('input')[1].checked).toBe(true);
    });

    test('should set value from checked', fakeAsync(() => {
      templateLookup.hostComponent.checked = 1;

      templateLookup.detectChanges();
      tick(100);

      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(RadiosGroupComponent).value).toEqual({ id: 1, name: 'yes' });
      expect(templateLookup.hostComponent.valueChange).toBeCalledWith({ id: 1, name: 'yes' });
    }));

    test('should set value when check', fakeAsync(() => {
      templateLookup.detectChanges();

      templateLookup.queryAll<HTMLInputElement>('input')[0].click();
      templateLookup.detectChanges();
      tick(100);

      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(templateLookup.getComponent(RadiosGroupComponent).value).toEqual({ id: 1, name: 'yes' });
      expect(templateLookup.hostComponent.valueChange).toBeCalledWith({ id: 1, name: 'yes' });
    }));

    test('should create disabled', fakeAsync(() => {
      // WHEN
      templateLookup.hostComponent.disabled = true;
      tick(50);
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    }));
  });

  describe('Without EqualsFn', () => {
    let templateLookup: TemplateLookup<HostWithoutEqualsFnComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup(TestBed.createComponent(HostWithoutEqualsFnComponent));
      templateLookup.detectChanges();
    });

    test('should create', fakeAsync(() => {
      // WHEN
      templateLookup.queryAll<HTMLInputElement>('input')[0].click();
      templateLookup.detectChanges();
      tick(100);

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
      expect(
        templateLookup
          .getComponent(RadiosGroupComponent)
          .equalsFn(templateLookup.getComponent(RadiosGroupComponent).value, 1)
      ).toBe(true);
    }));
  });
});

@Component({
  template: ` <gro-radios-group
    name="yesOrNo"
    [value]="value"
    [disabled]="disabled"
    [equalsFn]="equalsFn"
    (valueChange)="valueChange($event)"
  >
    <gro-radio [value]="{ id: 1, name: 'yes' }" [checked]="checked === 1">Yes</gro-radio>
    <gro-radio [value]="{ id: 2, name: 'no' }" [checked]="checked === 2">No</gro-radio>
  </gro-radios-group>`,
})
class HostComponent {
  public checked: Nullable<number> = null;

  public value: Nullable<{ id: number; name: string }> = null;

  public disabled = false;

  public equalsFn: EqualsFn<{ id: number; name: string }> = (
    val1: Nullable<{ id: number; name: string }>,
    val2: Nullable<{ id: number; name: string }>
  ) => val1?.id === val2?.id;

  public valueChange(val: { id: number; name: string }): void {
    this.value = val;
  }
}

@Component({
  template: ` <gro-radios-group name="yesOrNo">
    <gro-radio [value]="1">Yes</gro-radio>
    <gro-radio [value]="2">No</gro-radio>
  </gro-radios-group>`,
})
class HostWithoutEqualsFnComponent {}