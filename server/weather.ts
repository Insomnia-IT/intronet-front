import { dbCtrl } from './db-ctrl'
import { Fn } from "@cmmn/core";

const apiKey = process.env.METEOBLUE_API_KEY;
// https://docs.meteoblue.com

const lat = 54.679170
const lon = 35.0877288
const asl = 155
const format = 'json'

interface WeatherData {
  metadata: {
    modelrun_updatetime_utc: string;
    name: string;
    height: number;
    timezone_abbrevation: string;
    latitude: number;
    modelrun_utc: string;
    longitude: number;
    utc_timeoffset: number;
    generation_time_ms: number;
  };
  units: {
    predictability: string;
    precipitation: string;
    windspeed: string;
    precipitation_probability: string;
    relativehumidity: string;
    temperature: string;
    time: string;
    pressure: string;
    winddirection: string;
  };
  data_1h: {
    time: string[];
    snowfraction: number[];
    windspeed: number[];
    temperature: number[];
    precipitation_probability: number[];
    convective_precipitation: number[];
    rainspot: string[];
    pictocode: number[];
    felttemperature: number[];
    precipitation: number[];
    isdaylight: number[];
    uvindex: number[];
    relativehumidity: number[];
    sealevelpressure: number[];
    winddirection: number[];
  };
  data_day: {
    time: string[];
    temperature_instant: number[];
    precipitation: number[];
    predictability: number[];
    temperature_max: number[];
    sealevelpressure_mean: number[];
    windspeed_mean: number[];
    precipitation_hours: number[];
    sealevelpressure_min: number[];
    pictocode: number[];
    snowfraction: number[];
    humiditygreater90_hours: number[];
    convective_precipitation: number[];
    relativehumidity_max: number[];
    temperature_min: number[];
    winddirection: number[];
    felttemperature_max: number[];
    indexto1hvalues_end: number[];
    relativehumidity_min: number[];
    felttemperature_mean: number[];
    windspeed_min: number[];
    felttemperature_min: number[];
    precipitation_probability: number[];
    uvindex: number[];
    indexto1hvalues_start: number[];
    rainspot: string[];
    temperature_mean: number[];
    sealevelpressure_max: number[];
    relativehumidity_mean: number[];
    predictability_class: number[];
    windspeed_max: number[];
  };
}

enum WeatherCategory {
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

const getWeatherCategory = (code: number): WeatherCategory => {
  for (const [category, codes] of Object.entries(groupingRules)) {
    if (codes.includes(code)) return category as WeatherCategory;
  }
  return WeatherCategory.CLEAR;
}

const updateTask = async (apiKey: string) => {
  const currentHour = new Date().getHours();
  const data = await fetch(
    `https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=${apiKey}&lat=${lat}&lon=${lon}&asl=${asl}&format=${format}`
  ).then(res => res.json() as Promise<WeatherData | {error: true, error_message: string}>);

  if ('error' in data) {
    console.warn(data.error_message);
    return;
  }

  const currentTemperature = data.data_1h.temperature[currentHour];
  const currentCondition = getWeatherCategory(data.data_1h.pictocode[currentHour]);

  // 7:00-12:00 morning
  const morningBounds = [7, 12] as [number, number];
  // 13:00-18:00 day
  const afternoonBounds = [13, 18] as [number, number];
  // 19:00-23:00 evening
  const eveningBounds = [19, 23] as [number, number];
  // 00:00-6:00 night
  const nightBounds = [0, 6] as [number, number];

  const getAvgs = (day: number, bounds: [number, number]) => ({
    temperature: Math.round(data.data_1h.temperature.slice(day * 24 + bounds[0], day * 24 + bounds[1]).reduce((a, b) => a + b, 0) / (bounds[1] - bounds[0])),
    condition: getWeatherCategory(Number(Object.entries(
      data.data_1h.pictocode.slice(day * 24 + bounds[0], day * 24 + bounds[1]).reduce((dict, current) => ({...dict, [current]: (dict[current] ?? 0) + 1}), {} as Record<number, number>)
    ).sort((a, b) => b[1] - a[1])[0][0]))
  })

  const days = [0, 1, 2, 3, 4].map((day) => ({
    temperature: Math.round(day === 0 ? currentTemperature : data.data_day.temperature_mean[day]),
    feltTemperature: Math.round(data.data_day.felttemperature_mean[day]),
    condition: day === 0 ? currentCondition : getWeatherCategory(data.data_day.pictocode[day]),
    windSpeed: data.data_day.windspeed_mean[day],
    windDirection: data.data_day.winddirection[day],
    timesOfDay: {
      morning: getAvgs(day, morningBounds),
      afternoon: getAvgs(day, afternoonBounds),
      evening: getAvgs(day, eveningBounds),
      night: getAvgs(day, nightBounds)
    }
  }));

  dbCtrl.addOrUpdate('weather', {
    _id: Fn.ulid(),
    version: Fn.ulid(),
    days
  })
}

export const startWeatherUpdateTask = () => {
  if (!apiKey) {
    console.warn('Missing Meteoblue API key');
  } else {
    console.log('Weather task started');
    updateTask(apiKey);
    setInterval(() => new Date().getMinutes() === 0 && updateTask(apiKey), 30 * 1000);
  }
}
