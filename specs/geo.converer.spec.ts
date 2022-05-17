import {describe, expect, it} from "@jest/globals";
import {GeoConverter} from "../src/helpers/geo.converter";


const lngs = [54.675909, 54.687588] as [number, number];
const lats = [35.072132, 35.102046] as [number, number];
const w = 1024;
const h = 768;
const converter = new GeoConverter(lats, lngs, w, h);

describe('to geo converter', () => {
  it('center to center', () => {
    const geo = converter.toGeo({x: w/2, y: h/2});
    expect(geo.lng).toEqual((lngs[0] + lngs[1]) / 2);
    expect(geo.lat).toBeCloseTo((lats[0] + lats[1]) / 2, 0.0001);
  });

  it('center to center2', () => {
    const geo = converter.fromGeo({
      lat: (lats[0] + lats[1]) / 2,
      lng: (lngs[0] + lngs[1]) / 2
    });
    expect(geo.x).toEqual(w / 2);
    expect(geo.y).toBeCloseTo(h / 2, 0.0001);
  });

  it('topLeft', () => {
    const geo = converter.toGeo({x: 0, y: 0});
    expect(geo.lng).toEqual(lngs[0]);
    expect(geo.lat).toBeCloseTo(lats[0], 0.00001);
  });
  it('rightBottom', () => {
    const geo = converter.toGeo({x: w, y: h});
    expect(geo.lng).toEqual(lngs[1]);
    expect(geo.lat).toBeCloseTo(lats[1], 0.00001);
  });
})

describe('from geo converter', () => {
  it('center', () => {
    const geo = converter.fromGeo({
      lat: (lats[0] + lats[1]) / 2,
      lng: (lngs[0] + lngs[1]) / 2
    });
    expect(geo.x).toEqual(w / 2);
    expect(geo.y).toBeCloseTo(h / 2, 0.0001);
  });

  it('topLeft', () => {
    const geo = converter.fromGeo({
      lat: lats[0],
      lng: lngs[0]
    });
    expect(geo.x).toEqual(0);
    expect(geo.y).toBeCloseTo(0, 0.0001);
  });
  it('rightBottom', () => {
    const geo = converter.fromGeo({
      lat: lats[1],
      lng: lngs[1]
    });
    expect(geo.x).toEqual(w);
    expect(geo.y).toBeCloseTo(h, 0.0001);
  });
})
