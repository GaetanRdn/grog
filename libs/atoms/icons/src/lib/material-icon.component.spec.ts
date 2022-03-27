import { Component } from '@angular/core';
import { TemplateLookup } from '@grorg/tests';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { MaterialIconComponent } from '@grorg/atoms/icons';

describe('MaterialIconComponent', () => {
  let templateLookup: TemplateLookup<HostComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MaterialIconComponent, HostComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    templateLookup = new TemplateLookup(HostComponent);
  });

  test.each(['home', 'verified'])('should create %s icon', (icon: string) => {
    templateLookup.hostComponent.content = icon;
    templateLookup.detectChanges();
    expect(templateLookup.firstChildElement).toMatchSnapshot();
  });
});

@Component({
  template: ` <gro-material-icon>{{ content }}</gro-material-icon>`,
})
export class HostComponent {
  public content!: string;
}
