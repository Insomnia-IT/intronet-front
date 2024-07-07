import mb from "@mapbox/togeojson";
import { DOMParser } from "xmldom";
import fs from "fs";

const kmlContent = fs.readFileSync("./gp_v3_060724.kml", "utf-8");
const kmlDoc = new DOMParser().parseFromString(kmlContent, "text/xml");
const json = mb.kml(kmlDoc);
fs.writeFileSync("./locations2024.json", JSON.stringify(json), "utf8");
const data = json.features.map((feature) => ({
  name: feature.properties.name,
  geometry: JSON.stringify(feature.geometry.coordinates),
}));

const header = `name;geometry\n`;
const text = data.map((x) => [x.name, x.geometry].join(";")).join("\n");
fs.writeFileSync("./locations.csv", header + text, { encoding: "utf-8" });
