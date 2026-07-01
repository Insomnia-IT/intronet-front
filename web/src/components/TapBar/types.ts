import { routes } from "../../pages/routing";

export type TapBarItem = {
  id: keyof typeof routes;
  iconId:
    | '#tapbar-map'
    | '#tapbar-eye'
    | '#tapbar-favorite'
    | '#tapbar-magic'
    | '#tapbar-menu';
  name: string;
}
