import { Cell } from "@cmmn/cell";
import { Button, CloseButton } from "../../../components";
import { Label } from "../../../components/label/label";
import { useForm } from "../../../helpers/useForm";
import { newsStore } from "../../../stores/news.store";
import { useMemo } from "preact/hooks";
import { useRouter } from "../../routing";

export const EditNews = () => {
  const router = useRouter();
  const id = router.route[2];
  const cell = useMemo(() => new Cell(() => newsStore.get(id)), [id]);
  const ref = useForm<NewsItem>(cell);
  return (
    <>
      <div class="sh1">Добавить новость</div>
      <CloseButton />
      <form ref={ref} flex column gap="2" style={{ margin: "40px 0" }}>
        <Label
          required
          name="title"
          title="Заголовок"
          placeholder="Изменения в расписании"
        />
        <Label
          required
          name="text"
          title="Текст"
          inputType="textarea"
          rows={5}
          placeholder="Изменение в расписании Психологической беседки"
        />
        <Label name="link" title="Ссылка" placeholder="ссылка" />
        <Label
          name="linkText"
          title="Название ссылки"
          placeholder="Посмотреть расписание"
        />
      </form>
      <Button
        type="blue"
        onClick={async () => {
          await newsStore.update(cell.get());
          router.back();
        }}
      >
        обновить
      </Button>
    </>
  );
};
