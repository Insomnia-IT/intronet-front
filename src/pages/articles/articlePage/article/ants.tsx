import {Button, ButtonsBar, CloseButton} from "@components";
import {SvgIcon} from "@icons";

export function Ants() {
  return <div class="page text colorMediumBlue" flex gap="4">
    <h1>ПРО КЛЕЩЕЙ</h1>
    <CloseButton goTo="/main"/>
    На фестивале водятся комары, клещи и прочие кусачие насекомые.<br/><br/>
    Используйте репелленты!<br/><br/>
    Если вы обнаружили клеща, приходите в медпункт - поможем удалить.
    <ButtonsBar at="bottom">
      <Button type="vivid" class="w-full" goTo={['map', {name: 'медпункт'}]}>к медпункту</Button>
    </ButtonsBar>
  </div>
}
