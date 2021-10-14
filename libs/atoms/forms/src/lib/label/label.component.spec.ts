import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LabelComponent } from '@grorg/atoms-forms';
import { TemplateLookup } from '@grorg/tests';

describe('LabelComponent', () => {
  let templateLookup: TemplateLookup<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelComponent, HostComponent],
    });

    templateLookup = new TemplateLookup<HostComponent>(
      TestBed.createComponent(HostComponent)
    );
  });

  test.each(['toto', 'test'])(
    'should create with content %s',
    (label: string) => {
      // GIVEN
      templateLookup.hostComponent.label = label;

      // WHEN
      templateLookup.detectChanges();

      // THEN
      expect(templateLookup.firstChildElement).toMatchSnapshot();
    }
  );
});

@Component({
  template: ` <adr-label>{{ label }}</adr-label>`,
})
class HostComponent {
  public label!: string;
}
