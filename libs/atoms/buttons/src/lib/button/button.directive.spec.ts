import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ButtonDirective } from './button.directive';
import { TemplateLookup } from '@grorg/tests';

describe('ButtonDirective', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ButtonDirective, BasicButtonComponent],
      }).compileComponents();
    })
  );

  describe('Default', () => {
    let templateLookup: TemplateLookup<BasicButtonComponent>;

    beforeEach(() => {
      templateLookup = new TemplateLookup(TestBed.createComponent(BasicButtonComponent));
    });

    test.each`
      size        | color
      ${'small'}  | ${'default'}
      ${'small'}  | ${'primary'}
      ${'small'}  | ${'accent'}
      ${'small'}  | ${'error'}
      ${'medium'} | ${'default'}
      ${'medium'} | ${'primary'}
      ${'medium'} | ${'accent'}
      ${'medium'} | ${'error'}
      ${'large'}  | ${'default'}
      ${'large'}  | ${'primary'}
      ${'large'}  | ${'accent'}
      ${'large'}  | ${'error'}
    `('should create with size $size and color $color', ({ size, color }) => {
      // GIVEN
      templateLookup.hostComponent.size = size;
      templateLookup.hostComponent.color = color;

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    });
  });
});

@Component({
  template: ` <button groButton [size]="size" [color]="color">Click Me</button>`,
})
class BasicButtonComponent {
  public size!: ButtonDirective['size'];
  public color!: ButtonDirective['color'];
}
