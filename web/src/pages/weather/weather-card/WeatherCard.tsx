import { Card } from '@components'
import { DayWeatherReport, getWeatherCategoryByCondition, getWeatherIconByCategory, WeatherCategory} from '@stores/weather.store'
import styles from './WeatherCard.module.css'
import { SvgIcon } from '@icons';

interface WeatherCardProps extends DayWeatherReport {
  day: Day;
  isExpanded?: boolean;
  onClick?: () => void
}

const getDirByDegree = (degree: number): 'С' | 'СВ' | 'В' | 'ЮВ' | 'Ю' | 'ЮЗ' | 'З' | 'СЗ' => {
  if (degree < 22.5) return 'С'
  if (degree < 67.5) return 'СВ'
  if (degree < 112.5) return 'В'
  if (degree < 157.5) return 'ЮВ'
  if (degree < 202.5) return 'Ю'
  if (degree < 247.5) return 'ЮЗ'
  if (degree < 292.5) return 'З'
  if (degree < 337.5) return 'СЗ'
  return 'С'
}

const getTimeName = (time: 'morning' | 'afternoon' | 'evening' | 'night') => {
  switch (time) {
    case 'morning':
      return 'Утро'
    case 'afternoon':
      return 'День'
    case 'evening':
      return 'Вечер'
    case 'night':
      return 'Ночь'
  }
}

export const WeatherCard = ({day, isExpanded, onClick, temperature, feltTemperature, windSpeed, windDirection, condition, timesOfDay}: WeatherCardProps) => {
  const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU', {weekday: 'long', day: 'numeric', month: 'long'});

  if (isExpanded) return (
    <Card className={styles.expandedWeatherCard} background='Soft2' onClick={onClick}>
      <div className={styles.dayInfo}>
        <div className={styles.dayData}>
          <h4 className={styles.day}>{date}</h4>
          <h2 className={styles.temperature}>{temperature > 0 ? '+' : ''}{temperature}°C</h2>
          <h4 className={styles.condition}>{getWeatherCategoryByCondition(condition)}</h4>
          <div className={styles.additionalInfo}>
            <div className={styles.felt}><div>Ощущается</div><div>{feltTemperature > 0 ? '+' : ''}{feltTemperature}°C</div></div>
            <div className={styles.wind}><div>Ветер</div><div>{windSpeed} м/с, {getDirByDegree(windDirection)}</div></div>
          </div>
        </div>
        <div className={styles.icon}>
          <SvgIcon id={getWeatherIconByCategory(getWeatherCategoryByCondition(condition))} size={68} />
        </div>
      </div>
      <div className={styles.timesOfDay}>
        {Object.entries(timesOfDay).map(([key, timeOfDay]) => <div key={key} className={styles.timeOfDay}>
          <div>{getTimeName(key as 'morning' | 'afternoon' | 'evening' | 'night')}</div>
          <div><SvgIcon id={getWeatherIconByCategory(getWeatherCategoryByCondition(timeOfDay.condition))}/></div>
          <div>{timeOfDay.temperature > 0 ? '+' : ''}{timeOfDay.temperature}°C</div>
          <div>{getWeatherCategoryByCondition(timeOfDay.condition)}</div>
        </div>)}
      </div>
    </Card>
  )

  return (
    <Card className={styles.weatherCard} background='Soft2' onClick={onClick}>
      <div class={styles.date}>{date.split(',').map((x, i) => <div key={i}>{x}</div>)}</div>
      <div>{getWeatherCategoryByCondition(condition)}</div>
      <div class={styles.temp}>{temperature > 0 ? '+' : ''}{temperature}°C/{timesOfDay.night.temperature > 0 ? '+' : ''}{timesOfDay.night.temperature}°C</div>
    </Card>
  )
}
