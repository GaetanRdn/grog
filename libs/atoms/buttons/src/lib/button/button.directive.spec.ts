import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonDirective } from './button.directive';

describe('ButtonDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonDirective, DefaultComponent, WithSizeComponent, CoerceOutlinedComponent, WithColorsComponent]
    });
  });

  describe('Default', () => {
    let fixture: ComponentFixture<DefaultComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(DefaultComponent);
    });

    test('should create default button', () => {
      // WHEN
      fixture.detectChanges();

      // THEN
      expect(fixture.debugElement.children[0].nativeElement).toMatchSnapshot();
    });
  });

  describe('Size cases', () => {
    let fixture: ComponentFixture<WithSizeComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(WithSizeComponent);
    });

    test.each([
      'small',
      'medium',
      'large'
    ] as ('small' | 'medium' | 'large')[])('when size is %s then check snapshot', (size: 'small' | 'medium' | 'large') => {
      // GIVEN
      fixture.componentInstance.size = size;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(fixture.debugElement.children[0].nativeElement).toMatchSnapshot();
    });
  });

  describe('Outlined cases', () => {
    let fixture: ComponentFixture<CoerceOutlinedComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CoerceOutlinedComponent);
    });

    test('should create', () => {
      // WHEN
      fixture.detectChanges();

      // THEN
      expect(fixture.debugElement.children[0].nativeElement).toMatchSnapshot();
    });

  });

  describe('Color cases', () => {
    let fixture: ComponentFixture<WithColorsComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(WithColorsComponent);
    });

    test.each([
      'primary',
      'accent',
      'warn'
    ] as ('primary' | 'accent' | 'warn')[])('when color is %s then check snapshot', (color: 'primary' | 'accent' | 'warn') => {
      // GIVEN
      fixture.componentInstance.color = color;

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(fixture.debugElement.children[0].nativeElement).toMatchSnapshot();
    });
  });
});

@Component({
  template: `
      <button groButton>Click Me</button>`
})
class DefaultComponent {
}

@Component({
  template: `
      <button groButton size="{{size}}">Click Me</button>`
})
class WithSizeComponent {
  public size!: 'small' | 'medium' | 'large';
}

@Component({
  template: `
      <button groButton color="{{color}}">Click Me</button>`
})
class WithColorsComponent {
  public color?: 'primary' | 'accent' | 'warn';
}

@Component({
  template: `
      <button groButton outlined>Click Me</button>`
})
class CoerceOutlinedComponent {
}
