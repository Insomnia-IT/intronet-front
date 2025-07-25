import { Link, PageLayout, CloseButton } from "@components";

export function Art() {
  return (
    <PageLayout title="Арт-объекты" gap={4}>
      <CloseButton goTo="/main" />
      <div>
        Мы хотели наполнить поле арт-объектами, чтобы еще больше погрузиться в
        фантастическую атмосферу. Для этого мы устроили конкурс «Затмение».
      </div>
      <h3 class="sh1" style={{ marginTop: 4 }}>
        Победители конкурса — 2025
      </h3>
      Шаманское святилище, открывающее портал в мир духов природы. Расписные столбы-тотемы раскрывают свою суть ночью, 
      являясь воплощением Бессонничной магии.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "Затмение. Лес" }}>
      Инсталляция «Лес»
      </Link>
      Из темноты и морока медленно проявляется рыба‑удильщик. Чешуя оживает теплым светом, глаза вспыхивают янтарным кругом.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "Туманная Рыба" }}>
      Challwa (Туманная рыба)
      </Link>
      Тихое место, где посетители могут уйти от суеты и шума, созданного активной атмосферой фестиваля.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "Загорало" }}>
      Загорало
      </Link>
      Мифические предки готовы поделиться прохладой с гостями фестиваля. В буквальном смысле сделать вас чище!
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "Антифонтан" }}>
      Антифонтан
      </Link>
      348 серия энтомологического сериала «Старейшины» посвящена проблемам взращивания поросли в условиях дикой природы.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "Поросль" }}>
      Арт-продленка «Поросль»
      </Link>
      На противоположных концах поля стоят две телефонные будки. Между ними — связь, провод и не знакомый человек на другом конце.
      <Link
        style={{ marginTop: -8 }} goTo="/map" query={{ name: "Линия связи" }}>
        Линия связи
      </Link>
      Погружение в измерение коллективной музыкальной импровизации и звуковой терапии.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "HarmonyStan" }}>
      HarmonyStan
      </Link>
      <h3 class="sh1" style={{ marginTop: 4 }}>
        Вне конкурса
      </h3>
      О путник, бредущий по полю, изнывающий от палящего солнца, не хочешь ли ты укрыться в ветвях воды? 
      Там, за полем, в холодной речке, вдали от глаз, есть тотем дождю. 
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "Ветви воды" }}>
      Фонтан «Ветви воды»
      </Link>
    </PageLayout>
  );
}
