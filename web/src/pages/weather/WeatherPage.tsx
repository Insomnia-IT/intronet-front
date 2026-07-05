import { useCell } from '@helpers/cell-state'
import { PageLayout } from "@components/PageLayout";
import { weatherStore } from '@stores/weather.store'
import styles from "./WeatherPage.module.css";
import { WeatherCard } from './weather-card/WeatherCard'
import { useState } from 'preact/hooks'

export const WeatherPage = () => {
  const weather = useCell(() => weatherStore.weather);
  const [expandedDay, setExpandedDay] = useState(0);
  return (
    <PageLayout
      title='погода'
      withCloseButton
      className={styles.weatherPage}
    >
      {weather ? weather.days.map((dayReport, day) =>
        <WeatherCard
          key={day}
          day={day as Day}
          isExpanded={expandedDay === day}
          {...dayReport}
          onClick={() => setExpandedDay(day)}
        />
      ) : <h2>Прогноз погоды не доступен</h2>}
    </PageLayout>
  );
};
