import { describe, it, jest } from "@jest/globals";
//@ts-ignore
import { createCanvas, loadImage } from "canvas";
import * as fs from "fs";
import { TileConverter } from "@helpers/tile.converter";
const lats = [54.6926, 54.6739];
const lngs = [35.055, 35.1059];
const converter = new TileConverter();

function geoToIJ(geo: { lat; lng }, level: number) {
  const { X: x, Y: y } = converter.fromGeo({ lon: geo.lng, lat: geo.lat });
  return {
    i: Math.floor(x * 2 ** level),
    j: Math.floor(y * 2 ** level),
  };
}

jest.setTimeout(5000000);
const abc = () => 'abc'[Math.floor(Math.random() * 3)];
const getUrl = (z, x, y) =>
  `https://${abc()}.tile.thunderforest.com/thunderforest.transport-v2/${z}/${x}/${y}.vector.pbf?apikey=4fb4ac8dd7614138877f11c7eb177c98`
  // `https://${abc()}.tile.opentopomap.org/${z}/${x}/${y}.png`;
// `https://core-sat.maps.yandex.net/tiles?l=sat&v=3.1016.0&x=${x}&y=${y}&z=${z}&scale=1&lang=ru_RU`;
describe("maps load", () => {
  it("should get maps", async () => {
    const z = 15;
    const leftTop = geoToIJ({ lat: lats[0], lng: lngs[0] }, z);
    const rightBottom = geoToIJ({ lat: lats[1], lng: lngs[1] }, z);
    console.log(leftTop, rightBottom);
    const canvas = createCanvas(
      (rightBottom.i - leftTop.i + 1) * 256,
      (rightBottom.j - leftTop.j + 1) * 256
    );
    const context = canvas.getContext("2d");
    for (let i = leftTop.i; i < rightBottom.i + 1; i++)
      for (let j = leftTop.j; j < rightBottom.j + 1; j++) {
        const url = getUrl(z, i, j);
        try {
          const image = await loadImage(url);
          context.drawImage(
            image,
            (i - leftTop.i) * 256,
            (j - leftTop.j) * 256,
            256,
            256
          );
          console.log(url);
        } catch (e) {
          try {
            const image = await loadImage(url);
            context.drawImage(
              image,
              (i - leftTop.i) * 256,
              (j - leftTop.j) * 256,
              256,
              256
            );
            console.log(url);
          } catch (e) {
            console.log(url, e);
          }
        }
      }
    const out = fs.createWriteStream(
        `./map_${z}_${leftTop.i}_${leftTop.j}_${rightBottom.i}_${rightBottom.j}.png`
    );
    const png = canvas.createPNGStream();
    png.pipe(out);
    await new Promise((resolve) => out.on("finish", resolve));
  });
});
