import { cell, Cell } from "@cmmn/cell";
import { ObservableDB } from "./observableDB";

interface Report {
    temperature: number;
    condition: number;
}

export interface DayWeatherReport {
  temperature: number;
  feltTemperature: number;
  condition: number;
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

export enum WeatherCategory {
  CLEAR = "Ясно",
  PARTLY_CLOUDY = "Переменная облачность",
  CLOUDY = "Облачно",
  OVERCAST = "Пасмурно",
  FOG = "Туман",
  LIGHT_RAIN = "Небольшой дождь",
  RAIN = "Дождь",
  HEAVY_RAIN = "Сильный дождь",
  SNOW = "Снег",
  THUNDERSTORM = "Гроза"
}

// https://content.meteoblue.com/en/research-education/specifications/standards/symbols-and-pictograms
const groupingRules: Record<WeatherCategory, number[]> = {
  [WeatherCategory.CLEAR]: [1, 2, 3, 4, 5, 6, 13, 14, 15],
  [WeatherCategory.PARTLY_CLOUDY]: [7, 8, 9],
  [WeatherCategory.CLOUDY]: [10, 11, 12, 19, 20, 21],
  [WeatherCategory.OVERCAST]: [22],
  [WeatherCategory.FOG]: [16, 17, 18],
  [WeatherCategory.LIGHT_RAIN]: [33],
  [WeatherCategory.RAIN]: [23, 31],
  [WeatherCategory.HEAVY_RAIN]: [25],
  [WeatherCategory.SNOW]: [24, 26, 29, 32, 34, 35],
  [WeatherCategory.THUNDERSTORM]: [27, 28, 30]
};

export const getWeatherCategoryByCondition = (code: number): WeatherCategory => {
  for (const [category, codes] of Object.entries(groupingRules)) {
    if (codes.includes(code)) return category as WeatherCategory;
  }
  return WeatherCategory.CLEAR;
}

export type WeatherIconId =
  | '.weather #sun'
  | '.weather #partly-cloudy'
  | '.weather #cloudy'
  | '.weather #rain'
  | '.weather #moon';

export const getWeatherIconByCategory = (category: WeatherCategory): WeatherIconId => {
  switch (category) {
    case WeatherCategory.CLEAR:
      const hours = new Date().getHours();
      return hours < 6 || hours > 22 ? '.weather #moon' : '.weather #sun'
    case WeatherCategory.PARTLY_CLOUDY:
      return '.weather #partly-cloudy'
    case WeatherCategory.CLOUDY:
    case WeatherCategory.OVERCAST:
    case WeatherCategory.FOG:
      return '.weather #cloudy'
    case WeatherCategory.LIGHT_RAIN:
    case WeatherCategory.RAIN:
    case WeatherCategory.HEAVY_RAIN:
    case WeatherCategory.SNOW:
    case WeatherCategory.THUNDERSTORM:
      return '.weather #rain'
  }
}

class WeatherStore {
  @cell public db = new ObservableDB<WeatherReport>("weather");

  public get weather(): WeatherReport | undefined {
    const weatherReports = this.db.toArray();
    return weatherReports[weatherReports.length - 1];
  }

  public state = new Cell(() => (this.weather));
}

export const weatherStore = new WeatherStore();
globalThis["weatherStore"] = weatherStore;
