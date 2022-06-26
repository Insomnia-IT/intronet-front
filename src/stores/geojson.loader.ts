const locations = require("./locations.json");

export function getLocations() {
  return locations.features
    .filter((x) => x.geometry.type == "Point")
    .map(
      (x, index) =>
        ({
          id: index,
          name: x.properties.Name,
          x: 0,
          y: 0,
          tags: [],
          image: "camping",
          lat: x.geometry.coordinates[1],
          lon: x.geometry.coordinates[0],
        } as InsomniaLocation)
    );
}
