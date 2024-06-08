import { CloseButton, PageLayout } from "@components";

export function GoAway() {
  return <PageLayout title='Как уехать'>
    <CloseButton goTo="/main"/>
    <br/>
    <div class="sh1">Калужские автобусы</div>
    Стоимость билета в одну сторону — 600 рублей. Оплата осуществляется на месте представителю транспортной компании.<br/>
    От «Бессонницы» до вокзала «Калуга-1»<br/>
    <ul className="disc">
      <li>воскресенье, 16 июля: с 12:00 до 17:00 по мере заполнения</li>
      <li>понедельник, 17 июля: с 11:30 - 15:00 по мере заполнения</li>
    </ul>
    <br/>
    <div class="sh1">Памятка</div>
    <ul class="disc">
      <li>Перевозчик оставляет за собой право отложить отправление автобуса до набора необходимого минимума
        пассажиров.</li>
      <li>Дети до 7 лет, не занимающие отдельного места — бесплатно.</li>
      <li>Собаки — в намордниках.</li>
      <li>Время в пути — 2 часа.</li>
      <li>Место посадки: при выходе с жд-вокзала гостей будут встречать представители транспортной компании и показывать
        место посадки.</li>
      <li>Предварительной брони мест нет.</li>
      <li>Организатор имеет право отказать в проезде лицам, находящимся в состоянии опьянения.</li>
    </ul>
    <div className="sh1">Такси в Юхнове:</div>
    <a href="tel://+79190392202">+7 919 039 22 02</a>
    <a href="tel://+74843621207">+7 484 362 12 07</a>
    <a href="tel://+79533253366">+7 953 325 33 66</a>
    <a href="tel://+79100311122">+7 910 031 11 22</a>
    <a href="tel://+79605240800">+7 960 524 08 00</a>
    <a href="tel://+79208844778">+7 920 88 44 778</a>
    <div className="sh1">Автовокзал в Юхнове:</div>
    <a href="tel://+74843621304">+7 48436 2 13 04</a>
  </PageLayout>
}
