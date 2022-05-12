const path = require('path');
const ts = require('typescript');
const tsConfig = getTSConfig();
const aliases = Object.fromEntries(Object.entries(tsConfig.paths).map(([key, value]) =>
  [key.replace('/*',''), path.resolve(value[0].replace('/*',''))]));

module.exports = {
  core: {
    builder: "webpack5",
  },
  webpackFinal: async (config, {configType}) => {
    Object.assign(config.resolve.alias, aliases)
    return config;
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    '@storybook/preset-create-react-app'
  ],
  "framework": "@storybook/react",
  staticDirs: ['../public'],
};


function getTSConfig() {
  const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
  const readConfigFileResult = ts.readConfigFile(configPath, ts.sys.readFile);
  if (readConfigFileResult.error) {
    throw new Error(ts.formatDiagnostic(readConfigFileResult.error, formatHost));
  }
  const jsonConfig = readConfigFileResult.config;
  const convertResult = ts.convertCompilerOptionsFromJson(jsonConfig.compilerOptions, './');
  if (convertResult.errors && convertResult.errors.length > 0) {
    throw new Error(ts.formatDiagnostics(convertResult.errors, formatHost));
  }
  const compilerOptions = convertResult.options;
  return compilerOptions;
}
