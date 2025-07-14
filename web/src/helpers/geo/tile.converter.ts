import { bind } from "@cmmn/core";

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

  @bind
  public toGeo(figure: Figure): GeoFigure {
    if (Array.isArray(figure)) {
      if (Array.isArray(figure[0])) {
        return figure.map((line) => line.map((p) => this.toGeo(p) as Geo));
      }
      return figure.map((p) => this.toGeo(p) as Geo);
    }
    return {
      lon: x2lng((figure.X / this.scale + this.offset.x) / 2 ** this.zoom),
      lat: yToLat((figure.Y / this.scale + this.offset.y) / 2 ** this.zoom),
    };
  }

  public fromGeo(geo: Geo[][]): Array<Array<Point>>;
  public fromGeo(geo: Geo[]): Point[];
  public fromGeo(geo: Geo): Point;
  public fromGeo(geo: GeoFigure): Figure {
    if (!geo) return;
    if (Array.isArray(geo)) {
      if (Array.isArray(geo[0])) {
        return geo.map((arr) => arr.map((x) => this.fromGeo(x)));
      } else {
        return geo.map((x) => this.fromGeo(x)) as any;
      }
    }
    return {
      X: (lng2x(geo.lon) * 2 ** this.zoom - this.offset.x) * this.scale,
      Y: (latToY(geo.lat) * 2 ** this.zoom - this.offset.y) * this.scale,
    };
  }

  public getCenter(figure: Figure): Point {
    if (!Array.isArray(figure)) return figure;
    const flat = figure.flat();
    if (flat.length == 0) return { X: 0, Y: 0 };
    const length = flat.length;
    const sum = (a: Point, b: Point) => ({
      X: a.X + b.X,
      Y: a.Y + b.Y,
    });
    return flat.map((p) => ({ X: p.X / length, Y: p.Y / length })).reduce(sum);
  }
}

export const geoConverter = new TileConverter(
  {
    x: 156589.6,
    y: 83298.8,
  },
  17.999922,
  256
);
