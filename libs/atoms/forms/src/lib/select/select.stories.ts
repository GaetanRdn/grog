import { SelectComponent, SelectModule } from './select.component';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';

export default {
  title: 'atoms/forms/select',
  component: SelectComponent,
  decorators: [moduleMetadata({ imports: [SelectModule, BrowserAnimationsModule] })],
} as Meta<SelectComponent<unknown>>;

const template: Story<SelectComponent<string>> = () => ({
  props: {
    valueChange: action('Value change'),
  },
  template: `<gro-select placeholder="Select" (valueChange)="valueChange($event)">
    <gro-option>One</gro-option>
    <gro-option>Two</gro-option>
    <gro-option>Three</gro-option>
</gro-select>`,
});

export const Basic = template.bind({});
