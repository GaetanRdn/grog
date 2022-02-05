module.exports = {
  stories: [],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
    '@storybook/addon-jest',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource',
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => {
    return config;
  },
};
