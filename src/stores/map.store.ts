import { Observable } from "cellx-decorators";
import { TileConverter } from "../helpers/tile.converter";

class MapStore {
  constructor() {
    this.load("/images/schema.jpg", "jpg").then((x) => (this.Schema = x));
    this.load("/images/map.png", "png").then((x) => (this.Map = x));
  }

  load(url, type: "jpg" | "png"): Promise<ImageInfo> {
    return fetch(url)
      .then((x) => x.arrayBuffer())
      .then(async (x) => {
        const blob = new Blob([x], { type: `image/${type}` });
        const ib = await createImageBitmap(blob);
        return {
          url: URL.createObjectURL(blob),
          width: ib.width,
          height: ib.height,
        };
      });
  }

  @Observable
  public Schema: ImageInfo = null;

  @Observable
  public Map: ImageInfo = null;

  public MapGeoConverter = new TileConverter(
    {
      x: 39148,
      y: 20825,
    },
    16,
    256
  );
}

export const mapStore = new MapStore();
export type ImageInfo = {
  url: string;
  width: number;
  height: number;
};
