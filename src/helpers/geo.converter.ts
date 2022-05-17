function latToG(lat: number) {
  var s = Math.sin(lat / 180 * Math.PI);
  return Math.atanh(s);
}
function gToLat(g: number) {
  console.log(g);
  return Math.asin(Math.tanh(g)) / Math.PI * 180;
}

export class GeoConverter {
  private xToLng: number;
  private leftLng: number;
  private minG: number;
  private gToY: number;

  constructor(lats: [number, number], lngs: [number, number], width, private height) {
    lats.sort();
    lngs.sort();
    this.xToLng = width / (lngs[1] - lngs[0]);
    this.leftLng = lngs[0];
    const gs = lats.map(latToG);
    this.minG = gs[0];
    this.gToY = height / (gs[1] - gs[0]);
  }

  public toGeo(point: { x: number, y: number }) {
    return {
      lng: this.leftLng + point.x / this.xToLng,
      lat: gToLat(this.minG + point.y / this.gToY)
    }
  }

  public fromGeo(geo: { lat: number, lng: number }) {
    return {
      x: (geo.lng - this.leftLng) * this.xToLng,
      y: (latToG(geo.lat) - this.minG) * this.gToY
    }
  }
}

export const geoConverter = new GeoConverter(
  // широта нижней границы, широта верхней границы
  [54.675909, 54.687588],
  // долгота левой границы, правой границы
  [35.072132, 35.102046],
  // ширина картинки и высота
  1024, 768
);
