import { withTests } from '@storybook/addon-jest';
import 'cypress-storybook/angular';

import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import results from '../.jest-test-results.json';

setCompodocJson(docJson);

export const decorators = [
  withTests({
    results,
    filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
  }),
];
