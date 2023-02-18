import {BaseApi} from "./base";

class QRApi extends BaseApi {

  async checkUserQR(qr: string) {
    try {
      const result = await this.fetch('/api/qr/check?qr=' + qr);
      return !!result;
    } catch (e) {
      return false;
    }
  }
}

export const qrApi = new QRApi();
