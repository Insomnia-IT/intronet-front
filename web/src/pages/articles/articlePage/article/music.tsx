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
        <li>Black lama</li>
        <li>Krymov</li>
        <li>Princesse Angine</li>
        <li>Дом Сутягина</li>
        <li>Insomnia Improvisers</li>
        <li>Vespero</li>
        <li>Yarvi</li>
        <li>Чародейник</li>
        <li>Рубашка ft ОзЕрский</li>
        <li>БОУМ</li>
        <li>Виктор Скорбенко</li>
        <li>Конус Маха</li>
        <li>idst</li>
        <li>TLFP (the Legendary Flower Punk)</li>
        <li>Голос Земли</li>
        <li>Евгений Франкевич</li>
        <li>Настежь</li>
        <li>Видеоигры</li>
        <li>Lesya Lass</li>
        <li>samosad bend solo</li>
        <li>Дом прекрасных аустов и Дом престарелых аутистов</li>
        <li>Usssy</li>
        <li>миром правят собаки</li>
        <li>Шаййм</li>
        <li>Света Матвеева (Деревянные киты)</li>
        <li>Другое Дело</li>
        <li>orwell's magazine </li>
        <li>Secrets of the Third Planet</li>
        <li>Palobata и друзья</li>
        <li>Hajime Kojiro + Московская Шумовая Мануфактура </li>
        <li>Резина</li>
        <li>мерзавцы</li>
        <li>Cops on acid</li>
        <li>ускоритель частиц</li>
        <li>Айда</li>
        <li>... и другие!</li>
      </ul>


        <Link
          style={{ marginBottom: 8 }}
          goTo={['activities',{name: 'Музыкальная сцена'}]}
        >
          Расписание главной музыкальной сцены
        </Link>
        <Link
        style={{ marginBottom: 8 }}
        goTo={['activities',{name: 'Малая сцена'}]}
      >
        Расписание малой сцены «Пайтити»
      </Link>

    </PageLayout>
  );
}
