import {Button, ButtonsBar, CloseButton} from "../../../../components";
import {Card} from "../../../../components/cards";
import {Link} from "../../../../components/link/link";
import {useCell} from "../../../../helpers/cell-state";
import {SvgIcon} from "../../../../icons";
import {shopsStore} from "../../../../stores/articles.store";
import {useRouter} from "../../../routing";
import {orderBy} from "@cmmn/core";
import { PageLayout } from "@components/PageLayout";

export function Shops() {
  const router = useRouter();
  const id = router.route[2] as string | undefined;
  return <PageLayout title='Ярмарка'>
    {id ? <Shop id={id}/> : <ShopList/>}
    <ButtonsBar at="bottom">
      <Button type="blue" class="w-full" goTo="/map/?name=ярмарка">к ярмарке</Button>
    </ButtonsBar>
  </PageLayout>
}

const Shop = (props: {id: string}) => {
  const shop = useCell(() => shopsStore.getShop(props.id), [props.id]);
  if (!shop) return <></>
  return <div flex column gap="2" class="colorMediumBlue">
    <CloseButton goTo="/articles/shops"/>
    <div class="sh1">{shop.name}</div>
    <div class="text ">{shop.description}</div>
    {shop.links.split('\n').map(x => <a>{x}</a>)}
  </div>;
}

const ShopList = () => {
  const shops = useCell(() => shopsStore.shops);
  return <>
    <CloseButton goTo="/main"/>
    {orderBy(shops, x => x.name).map(s => <div key={s._id}>
      <Link goTo={['articles','shops',s._id]}>{s.name}</Link>
    </div>)}
  </>
}
