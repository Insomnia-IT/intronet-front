import { Button, ButtonsBar, CloseButton, PageLayout, Link } from "@components";
import { locationsStore } from "@stores";
import { useCell } from "@helpers/cell-state";

export function Music() {
  const location = useCell(() => locationsStore.findByName("Музыкальная"));
  const showTimetable = false;
  return (
    <PageLayout title="Музыка" gap={4}>
      <CloseButton goTo="/main" />
      <div class="sh2">В 2024 году на "Бессоннице" выступят:</div>
      <ul className="disc" style={{ margin: "4px 0" }}>
        <li>Хадн дадн</li>
        <li>другдиджея</li>
        <li>Yarga Sound System</li>
        <li>Краснознаменная дивизия имени моей бабушки</li>
        <li>Juniper</li>
        <li>Vanyn</li>
        <li>Purga</li>
        <li>ОРК и КО</li>
        <li>Аргишти</li>
        <li>Black Hole Surfers</li>
        <li>The RIG</li>
        <li>Лакоча</li>
        <li>IWKC</li>
        <li>Personal Exit</li>
        <li>Московская Шумовая Мануфактура</li>
        <li>трио РуКИ</li>
        <li>Holy Troyka</li>
        <li>Velcrocranes</li>
        <li>Шаййм</li>
        <li>Insomnia Improvisers Orchestra</li>
        <li>Настежь</li>
        <li>Где-то там</li>
        <li>Петяев-Петяев</li>
        <li>The Field 4</li>
        <li>Маагома</li>
        <li>Музыка волн</li>
        <li>Сахарный человек</li>
        <li>Sober Head</li>
        <li>KissLiar</li>
        <li>Coloristics</li>
        <li>Мандарины муркот</li>
        <li>ЗОРКИ ВО</li>
        <li>8Hz</li>
        <li>московский музыкальный синдикат</li>
        <li>... и другие!</li>
      </ul>

      {showTimetable ? (
        <Link
          style={{ marginBottom: 8 }}
          goTo={["activities", "location", location?._id]}
        >
          расписание муз сцена
        </Link>
      ) : (
        <div>Расписание выступлений появится позже.</div>
      )}
    </PageLayout>
  );
}
