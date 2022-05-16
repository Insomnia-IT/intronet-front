function latToY(lat) {
  const phi = (lat * Math.PI) / 180;
  return (1 - Math.log(Math.tan(phi) + 1 / Math.cos(phi)) / Math.PI) / 2;
}

function x2lng(x) {
  return x * 360 - 180;
}

function lng2x(lng) {
  return (lng + 180) / 360;
}

function yToLat(g: number) {
  var n = Math.PI - 2 * Math.PI * g;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

export class TileConverter {
  constructor(
    private offset: { x; y } = { x: 0, y: 0 },
    private zoom: number = 0,
    private scale: number = 1
  ) {}

  public toGeo(point: { x: number; y: number }) {
    return {
      lng: x2lng((point.x / this.scale + this.offset.x) / 2 ** this.zoom),
      lat: yToLat((point.y / this.scale + this.offset.y) / 2 ** this.zoom),
    };
  }

  public fromGeo(geo: { lat: number; lng: number }) {
    return {
      x: (lng2x(geo.lng) * 2 ** this.zoom - this.offset.x) * this.scale,
      y: (latToY(geo.lat) * 2 ** this.zoom - this.offset.y) * this.scale,
    };
  }
}

export const geoConverter = new TileConverter();
