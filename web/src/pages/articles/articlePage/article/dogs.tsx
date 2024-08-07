import { CloseButton, PageLayout, Link } from "@components";

export function Dogs() {
  return <PageLayout title='Про собак'>
    <CloseButton goTo="/main"/>
    <ul className="disc" style={{marginTop: 28, marginBottom: 10}}>
      <li>Собака все время должна быть на поводке, отпускать нельзя. Если собака может быть агрессивна по отношению к
        другим собакам — она должна быть в наморднике.</li>
      <li>Если нужно ненадолго отлучиться — оставьте собаку на привязи возле своей палатки на достаточно коротком поводке. Так,
        чтобы она не могла дотянуться до тех, кто проходит мимо. Не оставляйте собаку одну надолго.</li>
      <li>Животным категорически нельзя на территорию фудкорта и кафе! Мы не хотим, чтобы ваш питомец съел что-то, от
        чего ему будет плохо.</li>
      <li>И, конечно, не забывайте убирать за своим питомцем.</li>
    </ul>

    <span style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 10,
      marginBottom: 10
    }}>
    Если все-таки за собакой не уследили, и она потерялась, не паникуйте, обратитесь в Точку Сборки
    <Link goTo={['map',{name: 'точка'}]}>точка сборки</Link>
    </span>

    <span style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 10,
      marginBottom: 10
    }}>
      Если собака кого-то покусала, или вас покусала собака, проверьте, что вы знаете что делать
    <Link goTo={['map',{name: 'медпункт'}]}>мед. пункт</Link>
    </span>
  </PageLayout>
}
