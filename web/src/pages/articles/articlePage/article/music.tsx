import { CloseButton, PageLayout, Link } from "@components";
import { activitiesStore } from "@stores/activities/activities.store";
import { useCell } from "@helpers/cell-state";
import {
  buildParticipantPhotos,
  findParticipantPhoto,
} from "@helpers/participant-photo";
import styles from "./music.module.css";

const BANDS = [
  "Black lama",
  "Krymov",
  "Princesse Angine",
  "Дом Сутягина",
  "Insomnia Improvisers",
  "Vespero",
  "Yarvi",
  "Чародейник",
  "Рубашка ft ОзЕрский",
  "БОУМ",
  "Виктор Скорбенко",
  "Конус Маха",
  "idst",
  "TLFP (the Legendary Flower Punk)",
  "Голос Земли",
  "Евгений Франкевич",
  "Настежь",
  "Видеоигры",
  "Lesya Lass",
  "samosad bend solo",
  "Дом прекрасных аустов и Дом престарелых аутистов",
  "Usssy",
  "миром правят собаки",
  "Шаййм",
  "Света Матвеева (Деревянные киты)",
  "Другое Дело",
  "orwell's magazine",
  "Secrets of the Third Planet",
  "Palobata и друзья",
  "Hajime Kojiro + Московская Шумовая Мануфактура",
  "Резина",
  "мерзавцы",
  "Cops on acid",
  "ускоритель частиц",
  "Айда",
  "... и другие!",
];

export function Music() {
  const participantPhotos = useCell(() =>
    buildParticipantPhotos(activitiesStore.Activities)
  );

  return (
    <PageLayout title="Музыка" gap={4}>
      <CloseButton goTo="/main" />
      <div class="sh2">В 2025 году на "Бессоннице" выступят:</div>
      <ul className="disc" style={{ margin: "4px 0" }}>
        {BANDS.map((name) => {
          const photo = findParticipantPhoto(participantPhotos, name);
          return (
            <li key={name} className={styles.bandItem}>
              {photo && (
                <img className={styles.bandPhoto} src={photo} alt={name} />
              )}
              {name}
            </li>
          );
        })}
      </ul>

      <Link
        style={{ marginBottom: 8 }}
        goTo={["activities", { name: "Музыкальная сцена" }]}
      >
        Расписание главной музыкальной сцены
      </Link>
      <Link
        style={{ marginBottom: 8 }}
        goTo={["activities", { name: "Малая сцена" }]}
      >
        Расписание малой сцены «Пайтити»
      </Link>
    </PageLayout>
  );
}
