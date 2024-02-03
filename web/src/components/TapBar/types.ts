import { routes } from "../../pages/routing";

export type TapBarItem = {
  id: keyof typeof routes;
  iconId: '#shelter' | '#timetable' | '#map' | '#activities';
  name: string;
}
