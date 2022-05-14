import React, {useState} from "react";
import { MapComponent } from "./map";

const schemaAB = fetch('/images/schema.jpg')
  .then(x => x.arrayBuffer())
  .then(async x => {
    const blob = new Blob([x], {type: 'image/jpg'});
    const ib = await createImageBitmap(blob);
    return {
      url: URL.createObjectURL(blob),
      width: ib.width,
      height: ib.height
    };
  });


export function MapPage(){
  const [schema, setSchema] = useState<{url, width, height}>(null);
  schemaAB.then(setSchema);
  if (!schema)
    return <></>;
  return <MapComponent items={[]} {...schema} />
}
