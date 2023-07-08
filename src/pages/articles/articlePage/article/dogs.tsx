import {Button, ButtonsBar, CloseButton} from "@components";
import {Card} from "@components/cards";
import {Link} from "@components/link/link";
import {SvgIcon} from "@icons";
import {useRouter} from "../../../routing";

export function Dogs() {
  return <div class="page text colorMediumBlue" flex gap="4">
    <h1>Про собак</h1>
    <CloseButton goTo="/main"/>
    <ul className="disc" style={{margin: '4px 0'}}>
      <li>Собака все время должна быть на поводке, отпускать нельзя. Если собака может быть агрессивна по отношению к
        другим собакам — она должна быть в наморднике.</li>
      <li>Если нужно отлучиться — оставьте собаку на привязи возле своей палатки на достаточно коротком поводке. Так,
        чтобы она не могла дотянуться до тех, кто проходит мимо.</li>
      <li>Животным категорически нельзя на территорию фудкорта и кафе! Мы не хотим, чтобы ваш питомец съел что-то, от
        чего ему будет плохо.</li>
      <li>И, конечно, не забывайте убирать за своим питомцем.</li>
    </ul>
    Если все-таки за собакой не уследили, и она потерялась, не паникуйте, обратитесь с Точку Сборки
    <Link goTo="/map?name=точка">точка сборки</Link>
    Если собака кого-то покусала, или вас покусала собака, проверьте, что вы знаете что делать
    <Link goTo="/map?name=медпункт">мед. пункт</Link>
  </div>
}
