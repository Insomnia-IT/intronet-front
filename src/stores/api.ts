export const api = process.env.NODE_ENV === 'production'
  ? `/webapi`
  // : `/webapi`;
: `https://insight-prod.fransua.keenetic.pro/webapi`
  // : `https://insight.fransua.keenetic.pro/webapi`;
