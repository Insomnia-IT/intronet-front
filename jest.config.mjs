import config from "@cmmn/tools/test/config";

export default {
  ...config,
  testRegex: ".*/*\.specs?\.[jt]s$",
  moduleNameMapper: {
    ...config.moduleNameMapper,
    '^@cmmn/cell$': `@cmmn/cell/dist/bundle/lib.js`,
    '^pouchdb-browser$': '<rootDir>/specs/pouchdb-mock.ts'
  }
};
