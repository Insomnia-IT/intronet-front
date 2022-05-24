declare module "*.less" {
  const style: { [key: string]: string };
  export default style;
}

declare module "*.css" {
  const style: { [key: string]: string };
  export = style;
}

declare module "*.svg" {
  const style: string;
  export default style;
}

declare module "*.png" {
  const style: string;
  export default style;
}

declare module "*.module.css" {
  const style: any;
  export default style;
}

declare module "*.module.scss" {
  const style: any;
  export default style;
}

declare module "*.module.sass" {
  const style: any;
  export default style;
}

declare module "*.html" {
  const style: string;
  export default style;
}

type InsomniaLocation = {
  id: number;
  name: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  tags: number[];
  image: string;
};

type MapItem = {
  point: { x; y };
  icon;
  radius;
  id;
  title?: string;
};

type InsomniaLocationFull = Omit<InsomniaLocation, "tags"> & {
  tags: Tag[];
};

type Tag = {
  id: number;
  name: string;
};

type Movie = {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  author: string;
};
