import json from "./locations2024.json" assert { type: "json" };
import fs from "fs";

const data = json.features.map((feature) => ({
  name: feature.properties.name,
  geometry: JSON.stringify(feature.geometry.coordinates),
}));

const header = `name;geometry\n`;
const text = data.map((x) => [x.name, x.geometry].join(";")).join("\n");
fs.writeFileSync("./locations.csv", header + text, { encoding: "utf-8" });
