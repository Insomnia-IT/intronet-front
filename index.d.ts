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
  id: int; //id локации
  name: string; //название локации
  description: string; //описание локации
  image: string; //Содержит внутри себя ссылку на изображение для данной локации
  x: number; //x и y это местоположение объекта на нарисованной карте.
  y: number;
  lat: number; //lat и lon координаты для слоя на карте-спутнике.
  lon: number;
};
