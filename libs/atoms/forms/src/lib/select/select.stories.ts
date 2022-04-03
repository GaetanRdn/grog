import { SelectComponent, SelectModule } from './select.component';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export default {
  title: 'atoms/forms/select',
  component: SelectComponent,
  decorators: [moduleMetadata({ imports: [SelectModule, BrowserAnimationsModule, ReactiveFormsModule] })],
  parameters: {
    jest: ['select.component'],
  },
} as Meta<SelectComponent<unknown>>;

const templateForDefault: Story<SelectComponent<string>> = (args: SelectComponent<string>) => ({
  props: {
    valueChange: action('Value change'),
    disabled: Boolean(args.disabled),
  },
  template: `<gro-select placeholder="Select" (valueChange)="valueChange($event)" [disabled]="disabled">
    <gro-option>One</gro-option>
    <gro-option>Two</gro-option>
    <gro-option>Three</gro-option>
</gro-select>`,
});

export const Default = templateForDefault.bind({});

export const Disabled = templateForDefault.bind({});
Disabled.args = {
  disabled: true,
};

const templateForWithInitialValue: Story<SelectComponent<string>> = () => ({
  props: {
    valueChange: action('Value change'),
    value: 'Two',
  },
  template: `<gro-select placeholder="Select" [value]="value" (valueChange)="valueChange($event)">
    <gro-option>One</gro-option>
    <gro-option>Two</gro-option>
    <gro-option>Three</gro-option>
</gro-select>`,
});

export const WithInitialValue = templateForWithInitialValue.bind({});

const templateForReactiveForm: Story<SelectComponent<string>> = () => ({
  props: {
    valueChange: action('Value change'),
    control: new FormControl(),
  },
  template: `<gro-select placeholder="Select" [formControl]="control" (valueChange)="valueChange($event)">
    <gro-option>One</gro-option>
    <gro-option>Two</gro-option>
    <gro-option>Three</gro-option>
</gro-select>`,
});

export const ReactiveForm = templateForReactiveForm.bind({});
