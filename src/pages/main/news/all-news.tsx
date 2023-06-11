import {Button, CloseButton} from "@components";
import {Link} from "@components/link/link";
import {useCell} from "@helpers/cell-state";
import {SvgIcon} from "@icons";
import {authStore} from "@stores/auth.store";
import { newsStore } from "@stores/news.store";

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
      {isAdmin && <div flex gap={5}>
        <Button type="frame" goTo={["main", "news", x._id]}>
          <SvgIcon id="#edit"/>
          Редактировать
        </Button>
        <Button type="orange" onClick={() => newsStore.remove(x._id)}>
          <SvgIcon id="#trash" />
        </Button>
      </div>}
    </div>)}
    </div>
    {isAdmin && <Button type="blue" goTo={["main", "news", "add"]}>Добавить новость</Button>}
  </>
}
