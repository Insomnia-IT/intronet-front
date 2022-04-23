class Api {

  private fetch(url: string, options?: RequestInit) {
    return fetch(url, options)
      .then(resp => resp.json());
  }

  async checkUserQR(qr: string) {
    try {
      const result = await this.fetch('/api/qr/check?qr=' + qr);
      return result;
    } catch (e) {
      return false;
    }
  }
}

export const api = new Api();
