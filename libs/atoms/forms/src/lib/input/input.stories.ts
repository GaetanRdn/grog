import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputDirective } from '@grorg/atoms-forms';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/angular';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'adr-input-dummy',
  template: ` <input
    adrInput
    [disabled]="disabled"
    [readonly]="readonly"
    [value]="value"
    (valueChange)="valueChange.emit($event)"
    placeholder="default input"
  />`,
})
class InputDummyComponent {
  @Input()
  public value: any;

  @Input()
  public readonly: boolean = false;

  @Input()
  public disabled: boolean = false;

  @Output()
  public valueChange: EventEmitter<any> = new EventEmitter<any>();
}

export default {
  title: 'atoms/forms/input',
  argTypes: {
    value: { control: { type: 'text' } },
  },
  component: InputDummyComponent,
  parameters: {
    jest: ['input.directive.spec.ts'],
  },
} as Meta;

const BasicTemplate: Story<InputDummyComponent> = (args) => ({
  props: {
    ...args,
    valueChange: action('log'),
  },
  moduleMetadata: { declarations: [InputDirective] },
});

export const Default = BasicTemplate.bind({});
