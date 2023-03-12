import config from "@cmmn/tools/test/config";

export default {
  ...config,
  testRegex: "src/.*/*\.specs?\.[jt]s$",
  moduleNameMapper: {
    ...config.moduleNameMapper,
    '^@cmmn/cell/lib$': `@cmmn/cell/dist/bundle/lib.js`,
    '^pouchdb-browser$': '<rootDir>/specs/pouchdb-mock.ts'
  }
};
