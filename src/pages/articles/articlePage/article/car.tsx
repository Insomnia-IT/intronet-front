import {Button, ButtonsBar, CloseButton} from "@components";
import {Link} from "@components/link/link";
import {SvgIcon} from "@icons";

export function Car() {
  return <div class="page text colorMediumBlue" flex gap="4">
    <h1>Если машина застряла</h1>
    <CloseButton goTo="/main"/>
    Если машина застряла или сломалась, обратитесь на Инфоцентр и вам помогут.
<br/><br/>
    <Link goTo="/map" query={{name: 'инфоцентр'}}>к инфоцентру</Link>
    <br/>
    Если до инфоцентра далеко, ищите ближайшего волонтера с рацией.
  </div>
}
