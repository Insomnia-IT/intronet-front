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
        <Button type="borderVivid" goTo="/main/news/add">
          + добавить новость
        </Button>
      </>
    );
  return (
    <Card border="Vivid" background="Night" flex column center gap={0}>
      <div class="textSmall colorWhite">{state.news[0].time}</div>
      <div class="text colorWhite">{state.news[0].title}</div>
      <Link style={{ marginTop: 16 }} goTo="/main/news">
        {state.news.length > 1 ? "все новости" : "подробнее"}
      </Link>
    </Card>
  );
};
