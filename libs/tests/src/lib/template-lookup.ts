import { DebugElement, Predicate, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class TemplateLookup<T> {
  get firstChildElement(): HTMLElement {
    return this.fixture.debugElement.children[0].nativeElement;
  }

  get hostComponent(): T {
    return this.fixture.componentInstance;
  }

  constructor(public readonly fixture: ComponentFixture<T>) {}

  public detectChanges(): void {
    this.fixture.detectChanges();
  }

  public get(selectorOrType: string | Type<unknown>): DebugElement {
    let predicate: Predicate<DebugElement>;

    if (typeof selectorOrType === 'string') {
      predicate = By.css(selectorOrType);
    } else {
      predicate = By.directive(selectorOrType);
    }

    return this.fixture.debugElement.query(predicate);
  }

  public getAll(selectorOrType: string | Type<unknown>): DebugElement[] {
    let predicate: Predicate<DebugElement>;

    if (typeof selectorOrType === 'string') {
      predicate = By.css(selectorOrType);
    } else {
      predicate = By.directive(selectorOrType);
    }

    return this.fixture.debugElement.queryAll(predicate);
  }

  public getComponent<U>(selectorOrType: string | Type<U>): U {
    return this.get(selectorOrType).componentInstance;
  }

  public query<T extends HTMLElement>(selectorOrType: string | Type<unknown>): T {
    return this.get(selectorOrType).nativeElement;
  }

  public queryAll<T extends HTMLElement>(selectorOrType: string | Type<unknown>): T[] {
    return this.getAll(selectorOrType).map((debugElement: DebugElement) => debugElement.nativeElement);
  }
}
