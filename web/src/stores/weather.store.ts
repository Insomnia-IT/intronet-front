import { cell, Cell } from "@cmmn/cell";
import { ObservableDB } from "./observableDB";

interface Report {
    temperature: number;
    condition: string;
}

export interface DayWeatherReport {
  temperature: number;
  feltTemperature: number;
  condition: string;
  windSpeed: number;
  windDirection: number;
  timesOfDay: {
      morning: Report;
      afternoon: Report;
      evening: Report;
      night: Report;
  };
}

export interface WeatherReport {
  _id: string;
  version: string;
  days: DayWeatherReport[]
}

class WeatherStore {
  @cell public db = new ObservableDB<WeatherReport>("weather");

  public get weather(): WeatherReport | undefined {
    return this.db.toArray()[0];
  }

  public state = new Cell(() => (this.weather));
}

export const weatherStore = new WeatherStore();
globalThis["weatherStore"] = weatherStore;
