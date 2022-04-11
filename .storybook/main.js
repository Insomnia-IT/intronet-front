const path = require('path');

module.exports = {
  core : {
    builder : "webpack5" ,
  } ,
  webpackFinal: async (config, {configType}) => {
    config.module.rules[7].use[1].options.modules={localIdentName:"[folder]_[local]-[hash:base64:5]"};
    return config;
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  "framework": "@storybook/react",
  staticDirs: ['../public'],
};
