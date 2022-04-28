const path = require('path');
const ts = require('typescript');
const tsConfig = getTSConfig();
const aliases = Object.fromEntries(Object.entries(tsConfig.paths).map(([key, value]) =>
  [key.replace('/*',''), path.resolve(value[0].replace('/*',''))]));

console.log(aliases);
module.exports = {
  resolve: {
    alias: aliases
  }
}

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
