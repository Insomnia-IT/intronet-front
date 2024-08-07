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
        Победители конкурса - 2024
      </h3>
      Добрый монстр-великан, ненавязчиво соседствующий и наблюдающий за течением
      жизни на всей поляне.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "страж" }}>
        Лесной страж
      </Link>
      Серия плоских скульптур в форме силуэтов духов природы, органично
      распределенных по поляне фестиваля.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "силуэты" }}>
        СИЛУЭТЫ
      </Link>
      Идя в туманной дымке «Бессонницы», путники замечают странный металлический
      блеск. Подойдя ближе, они осознают, что среди густой травы находится нечто
      неземное. Что же это?
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "спутник" }}>
        Спутник-1
      </Link>
      Несколько больших ярких цветных камней лежат, образуя круг в поле, —
      кромлех.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "кромлех" }}>
        Цветной кромлех
      </Link>
      Последний выживший из мамонтов Манг Онт, поселившийся в лесах Калуги,
      добавит сказочности, станет ориентиром для навигации, местом встреч и
      напоминанием с кем мы живем бок о бок на этой планете.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "манг онт" }}>
        Манг Онт
      </Link>
      Коллеги, Старейшина имеет честь пригласить вас на научный симпозиум,
      посвящённый вопросам Клещерианства на Руси.
      <Link
        style={{ marginTop: -8 }}
        goTo="/map"
        query={{ name: "старейшины" }}
      >
        Зов Старейшины
      </Link>
      Главная цель настоящего Художника — сделать зрителей соавторами!
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "ыйи" }}>
        Сферические ЫЙи
      </Link>
      Мы пытаемся воспроизвести пространство жилого интерьера в не органичном
      для него контексте.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "дом 5" }}>
        Дом 5
      </Link>
      Пространство соединения общественного и личного, природного и
      человеческого, фантазии и реальности.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "легкость" }}>
        Легкость бытия
      </Link>
      Всегда видел сходство бессонных экранов с парусами. А паруса — это свобода
      и приключения.
      <Link style={{ marginTop: -8 }} goTo="/map" query={{ name: "парусник" }}>
        Парусник
      </Link>
    </PageLayout>
  );
}
