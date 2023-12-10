import {Button, ButtonsBar, CloseButton} from "../../../../components";
import {SvgIcon} from "../../../../icons";

export function Water() {
  return <div class="page" flex gap="4">
    <h1>Вода</h1>
    <CloseButton goTo="/main"/>
    <div class="text colorMediumBlue" style={{marginTop: 20, marginBottom: 16}}>
      Вода продается в пятилитровых бутылках на инфоцентре.
    </div>
    <div className="colorOrange" flex gap="3">
      <SvgIcon id="#alert" size={24} style={{color: "var(--chineese-cafe)", flex: 'auto 0 0'}}/>
      Техническую воду и воду из местного родника пить нельзя!
    </div>
    <ButtonsBar at="bottom">
      <Button type="vivid" class="w-full" goTo={['map',{name: 'инфоцентр'}]}>к инфоцентру</Button>
    </ButtonsBar>
  </div>
}
