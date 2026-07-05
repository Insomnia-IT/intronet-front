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

const updateTask = async (apiKey: string) => {
  const currentHour = new Date().getHours();
  let response: WeatherData | {error: true, error_message: string};
  try {
    response = await fetch(
      `https://my.meteoblue.com/packages/basic-1h_basic-day?apikey=${apiKey}&lat=${lat}&lon=${lon}&asl=${asl}&format=${format}`
    ).then(res => res.json() as Promise<WeatherData | {error: true, error_message: string}>);
  } catch (e) {
    console.warn('METEOBLUE_API_KEY is not provided/exceeded api limit');
    return;
  }

  if ('error' in response) {
    console.warn('METEOBLUE_API_KEY is not provided/exceeded api limit');
    return;
  }

  const data: WeatherData = response;

  const currentTemperature = data.data_1h.temperature[currentHour];
  const currentCondition = data.data_1h.pictocode[currentHour];

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
    condition: Number(Object.entries(
      data.data_1h.pictocode.slice(day * 24 + bounds[0], day * 24 + bounds[1]).reduce((dict, current) => ({...dict, [current]: (dict[current] ?? 0) + 1}), {} as Record<number, number>)
    ).sort((a, b) => b[1] - a[1])[0][0])
  })

  const days = [0, 1, 2, 3, 4].map((day) => ({
    temperature: Math.round(day === 0 ? currentTemperature : data.data_day.temperature_mean[day]),
    feltTemperature: Math.round(data.data_day.felttemperature_mean[day]),
    condition: day === 0 ? currentCondition : Number(data.data_day.pictocode[day]),
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
