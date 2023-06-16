import { TileConverter } from "@helpers/tile.converter";

class MapStore {

  public Map2GeoConverter = new TileConverter(
    {
      x: 156598,
      y: 83304,
    },
    18,
    256
  );
}

export const mapStore = new MapStore();
