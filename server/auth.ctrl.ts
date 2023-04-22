export const authCtrl = new (class {
  public async check(token: string) {
    if (!token) throw new Error(`Token not provided`);
    if (!/Bearer [\w\d]+/.test(token)) throw new Error(`Token invalid`);
  }
})();
