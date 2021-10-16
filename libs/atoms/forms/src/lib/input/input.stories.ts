import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputDirective } from './input.directive';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/angular';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'gro-input-dummy',
  template: ` <input
    groInput
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
  public readonly = false;

  @Input()
  public disabled = false;

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
