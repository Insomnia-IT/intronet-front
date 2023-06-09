import {Button, CloseButton} from "@components";
import {Label} from "@components/label/label";
import {Link} from "@components/link/link";
import {useCell} from "@helpers/cell-state";
import {useForm} from "@helpers/useForm";
import {authStore} from "@stores/auth.store";
import { newsStore } from "@stores/news.store";
import {useRouter} from "../../routing";

export const AllNews = () => {
  const state = useCell(newsStore.State);
  const isAdmin = useCell(() => authStore.isAdmin);
  return <>
    <div class="sh1">Важные новости</div>
    <CloseButton/>
    <div flex column gap={10}  style={{margin: '27px 0'}}>
    {state.news.map(x => <div key={x._id} flex column gap={1}>
      <span class="sh3">{x.time}</span>
      <span class="text">{x.text}</span>
      {x.link && <Link goTo={x.link as any}>{x.linkText}</Link>}
    </div>)}
    </div>
    {isAdmin && <Button type="blue" goTo={["main", "news", "add"]}>Добавить новость</Button>}
  </>
}
