import { cell } from "@cmmn/cell/lib";
import { TileConverter } from "@helpers/tile.converter";

class MapStore {
  constructor() {
    try {
      this.load("/public/images/schema4.webp").then((x) => (this.Schema = x));
      this.load("/public/images/map_17_78306_41656_78314_41663.png").then(
        (x) => (this.Map2 = x)
      );
    }catch (e){

    }
    // this.load("/images/map2.webp").then((x) => (this.Map2 = x));
  }

  load(
    url,
    type: "jpg" | "png" | "webp" = url.split(".").at(-1)
  ): Promise<ImageInfo> {
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

  @cell
  public Schema: ImageInfo = null;

  // @cell
  // public Map: ImageInfo = null;
  @cell
  public Map2: ImageInfo = null;
  //
  // public Map2GeoConverter = new GeoConverter(
  //   [54 + 40 / 60 + 29.1 / 3600, 54 + 41 / 60 + 7.5046 / 3600],
  //   [35 + 4 / 60 + 27.1508 / 3600, 35 + 5 / 60 + 53.6681 / 3600],
  //   4961,
  //   3633
  // );
  public Map2GeoConverter = new TileConverter(
    {
      x: 78306,
      y: 41656,
    },
    17,
    256
  );
}

export const mapStore = new MapStore();
export type ImageInfo = {
  url: string;
  width: number;
  height: number;
};
