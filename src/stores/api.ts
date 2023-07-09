export const api = process.env.NODE_ENV === 'production'
  ? `/webapi`
  // : `/webapi`;
  : `https://insight.fransua.keenetic.pro/webapi`;
