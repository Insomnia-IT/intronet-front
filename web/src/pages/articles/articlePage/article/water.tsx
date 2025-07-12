import {Button, ButtonsBar, CloseButton} from "../../../../components";
import {SvgIcon} from "../../../../icons";
import { PageLayout } from "@components/PageLayout";

export function Water() {
  return <PageLayout title='Вода'>
    <CloseButton goTo="/main"/>
    <div class="text" style={{marginTop: 20, marginBottom: 16}}>
      Вода продается в пятилитровых бутылках на инфоцентре.
    </div>
    <div className="colorVivid" flex gap="3">
      <SvgIcon id="#alert" size={24} style={{color: "var(--vivid)", flex: 'auto 0 0'}}/>
      Техническую воду и воду из местного родника пить нельзя!
    </div>
    <ButtonsBar at="bottom">
      <Button type="blue" class="w-full" goTo={['map',{name: 'инфоцентр'}]}>к инфоцентру</Button>
    </ButtonsBar>
  </PageLayout>
}
