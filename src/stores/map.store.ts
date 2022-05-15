import { Observable } from "cellx-decorators";

class MapStore {
  constructor() {
    this.load("/images/schema.jpg").then((x) => (this.Schema = x));
    this.load("/images/map.jpg").then((x) => (this.Map = x));
  }

  load(url): Promise<ImageInfo> {
    return fetch(url)
      .then((x) => x.arrayBuffer())
      .then(async (x) => {
        const blob = new Blob([x], { type: "image/jpg" });
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
}

export const mapStore = new MapStore();
export type ImageInfo = {
  url: string;
  width: number;
  height: number;
};
