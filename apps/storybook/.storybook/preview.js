import { withTests } from '@storybook/addon-jest';

import results from '../../../.jest-test-results.json';

export const decorators = [
  withTests({
    results,
    filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
  }),
];
