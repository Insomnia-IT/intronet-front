import {CloseButton, PageLayout} from "../../../../components";
import {Link} from "../../../../components/link/link";

export function Car() {
  return <PageLayout title='Если машина застряла'>
    <CloseButton goTo="/main"/>

    <span class="text colorMediumBlue" style={{marginTop: 20, marginBottom: 16}}>
      Если машина застряла или сломалась, обратитесь на Инфоцентр и вам помогут.
    </span>

    <Link goTo="/map" query={{name: 'инфоцентр'}}>к инфоцентру</Link>

    <span class="text colorMediumBlue" style={{marginTop: 20, marginBottom: 16}}>
      Если до Инфоцентра далеко, ищите ближайшего волонтера с рацией.
    </span>
  </PageLayout>
}
