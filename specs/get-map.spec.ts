import { describe, it, jest } from "@jest/globals";
import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import { TileConverter } from "../src/helpers/tile.converter";

const lats = [54.671053, 54.695172];
const lngs = [35.04889, 35.114379];
const converter = new TileConverter();

function geoToIJ(geo: { lat; lng }, level: number) {
  const { X: x, Y: y } = converter.fromGeo(geo);
  console.log(x, (1 - y) * 2 ** level);
  return {
    i: Math.floor(x * 2 ** level),
    j: Math.floor(y * 2 ** level),
  };
}

jest.setTimeout(500000);
const getUrl = (z, x, y) =>
  // `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
  `https://a.tile.opentopomap.org/${z}/${x}/${y}.png`;
// `https://core-sat.maps.yandex.net/tiles?l=sat&v=3.1016.0&x=${x}&y=${y}&z=${z}&scale=1&lang=ru_RU`;
describe("maps load", () => {
  it("should get maps", async () => {
    console.log(geoToIJ({ lat: 54.677157, lng: 0 }, 16));
    const z = 17;
    const leftTop = geoToIJ({ lat: lats[1], lng: lngs[0] }, z);
    const rightBottom = geoToIJ({ lat: lats[0], lng: lngs[1] }, z);
    console.log(leftTop, rightBottom);
    const canvas = createCanvas(
      (rightBottom.i - leftTop.i + 1) * 256,
      (rightBottom.j - leftTop.j + 1) * 256
    );
    const context = canvas.getContext("2d");
    for (let i = leftTop.i; i < rightBottom.i + 1; i++)
      for (let j = leftTop.j; j < rightBottom.j + 1; j++) {
        const url = getUrl(z, i, j);
        console.log(url);
        try {
          const image = await loadImage(url);
          context.drawImage(
            image,
            (i - leftTop.i) * 256,
            (j - leftTop.j) * 256,
            256,
            256
          );
        } catch (e) {}
      }
    const out = fs.createWriteStream(
      __dirname +
        `/map_${z}_${leftTop.i}_${leftTop.j}_${rightBottom.i}_${rightBottom.j}.png`
    );
    const png = canvas.createPNGStream();
    png.pipe(out);
    await new Promise((resolve) => out.on("finish", resolve));
  });
});
