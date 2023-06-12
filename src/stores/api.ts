export const api = process.env.NODE_ENV === 'production'
  ? `/webapi`
  : `https://redmine.cb27.ru:17443/webapi`;
