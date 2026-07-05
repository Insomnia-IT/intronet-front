import { Button } from "../../../components";
import { Card } from "../../../components/cards";
import { Link } from "../../../components/link/link";
import { useCell } from "../../../helpers/cell-state";
import { authStore } from "../../../stores/auth.store";
import { newsStore } from "../../../stores/news.store";

export const News = () => {
  const state = {
    news: useCell(newsStore.State).news,
    isAdmin: useCell(() => authStore.isAdmin),
  };

  if (state.news.length === 0 && !state.isAdmin) return <></>;

  if (state.news.length === 0 && state.isAdmin)
    return (
      <>
        <Button type="ghost" goTo="/main/news/add">
          добавить новость
        </Button>
      </>
    );
  return (
    <Card border="Accent" background="Light" flex column center gap={0}>
      <div class="textSmall">{state.news[0].time}</div>
      <div class="text colorWhite">{state.news[0].title}</div>
      <Link className="colorAccent" goTo="/main/news">
        {state.news.length > 1 ? "все новости" : "посмотреть"}
      </Link>
    </Card>
  );
};
