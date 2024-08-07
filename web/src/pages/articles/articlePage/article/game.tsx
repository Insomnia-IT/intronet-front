import {CloseButton, Link, PageLayout} from "@components";

export function Game() {
  return (
    <PageLayout title="ИГРА" withCloseButton className="text" gap={4}>
      <div class="text colorMediumBlue">
        Присоединяйтесь к анимаквесту «Кадроискатель»! Ищите кадры анимации расклеенные по территории фестиваля,
        фотографируйте,
        создайте гиф-анимацию и получите эксклюзивные авторские призы! Вас ждет 600 открыток, 90 флипбуков с собранными
        анимациями!
        Поторопитесь, чтобы успеть собрать уникальную коллекцию!
      </div>
      <div class="text colorMediumBlue"> Инструкцию и правила вы найдете на стенде недалеко от шатра Анимации. Именно
        оттуда начинается Квест.
      </div>
      <Link goTo={['map',{name: 'анимации'}]}>Шатёр Анимации</Link>
    </PageLayout>
  );
}
