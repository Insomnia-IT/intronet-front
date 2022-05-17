import {BaseApi} from "./base";

export class QRApi extends BaseApi {

  async checkUserQR(qr: string) {
    try {
      const result = await this.fetch('/api/qr/check?qr=' + qr);
      return !!result;
    } catch (e) {
      return false;
    }
  }
}
