import { Button, ButtonsBar, CloseButton, PageLayout, Link } from "@components";
import { locationsStore } from "@stores";
import { useCell } from "@helpers/cell-state";

export function Music() {
  const location = useCell(() => locationsStore.findByName("Музыкальная"));
  const showTimetable = false;
  return (
    <PageLayout title="Музыка" gap={4}>
      <CloseButton goTo="/main" />
      <div class="sh2">В 2026 году на "Бессоннице" выступят:</div>
      <ul className="disc" style={{ margin: "4px 0" }}>
        <li>Краснознаменная дивизия имени моей бабушки</li>
<li>Black Hole Surfers</li>
<li>Blednyj</li>
<li>Insomnia Improvisers Orchestra</li>
<li>KissLiar</li>
<li>Mosbrass</li>
<li>Ordo</li>
<li>Sadsadsergievposad</li>
<li>samosad bend solo</li>
<li>Special guest ОА</li>
<li>Vermicelli Orchestra</li>
<li>Видеоигры</li>
<li>Войка</li>
<li>Досвидошь</li>
<li>Нотэбёрд</li>
<li>Один в оленьем парке</li>
<li>Талисман</li>
<li>Теуникова & КоМПОзит</li>
<li>Топот dark trio</li>
<li>Шаййм</li>
        <li>... и другие!</li>
      </ul>


        <Link
          style={{ marginBottom: 8 }}
          goTo={['activities',{name: 'Музыкальная сцена'}]}
        >
          Расписание музыкальной сцены
        </Link>
    </PageLayout>
  );
}
