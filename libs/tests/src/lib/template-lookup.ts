import { DebugElement, Predicate, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class TemplateLookup<T> {
  private _fixture: ComponentFixture<T>;

  constructor(public readonly fixtureOrHostClass: ComponentFixture<T> | Type<T>) {
    if ('detectChanges' in fixtureOrHostClass) {
      this._fixture = fixtureOrHostClass;
    } else {
      this._fixture = TestBed.createComponent(fixtureOrHostClass);
    }
  }

  get firstChildElement(): HTMLElement {
    return this._fixture.debugElement.children[0].nativeElement;
  }

  get hostComponent(): T {
    return this._fixture.componentInstance;
  }

  public detectChanges(): void {
    this._fixture.detectChanges();
  }

  public get(selectorOrType: string | Type<unknown>): DebugElement {
    let predicate: Predicate<DebugElement>;

    if (typeof selectorOrType === 'string') {
      predicate = By.css(selectorOrType);
    } else {
      predicate = By.directive(selectorOrType);
    }

    return this._fixture.debugElement.query(predicate);
  }

  public getAll(selectorOrType: string | Type<unknown>): DebugElement[] {
    let predicate: Predicate<DebugElement>;

    if (typeof selectorOrType === 'string') {
      predicate = By.css(selectorOrType);
    } else {
      predicate = By.directive(selectorOrType);
    }

    return this._fixture.debugElement.queryAll(predicate);
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
