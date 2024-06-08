import { Button, ButtonsBar, CloseButton, PageLayout } from "../../../../components";
import {Link} from "../../../../components/link/link";
import {SvgIcon} from "../../../../icons";

export function Car() {
  return <PageLayout title='Если машина застряла'>
    <CloseButton goTo="/main"/>
    Если машина застряла или сломалась, обратитесь на Инфоцентр и вам помогут.
<br/><br/>
    <Link goTo="/map" query={{name: 'инфоцентр'}}>к инфоцентру</Link>
    <br/>
    Если до инфоцентра далеко, ищите ближайшего волонтера с рацией.
  </PageLayout>
}
