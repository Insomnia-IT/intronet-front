import {Button, CloseButton} from "../../../components";
import {Label} from "../../../components/label/label";
import {useCell} from "../../../helpers/cell-state";
import {useForm} from "../../../helpers/useForm";
import { newsStore } from "../../../stores/news.store";
import {useRouter} from "../../routing";

export const AddNews = () => {
  const ref = useForm<NewsItem>(newsStore.addNewsCell);
  const isValid = useCell(() => newsStore.isAddNewsValid);
  const router = useRouter();
  return <>
    <div class="sh1">Добавить новость</div>
    <CloseButton/>
    <form ref={ref} flex column gap="2" style={{margin: '40px 0'}}>
      <Label required name="title" title="Заголовок" placeholder="Изменения в расписании"/>
      <Label required name="text" title="Текст" inputType="textarea" rows={5}
             placeholder="Изменение в расписании Психологической беседки"/>
      <Label name="link" title="Ссылка" placeholder="ссылка"/>
      <Label name="linkText" title="Название ссылки" placeholder="Посмотреть расписание"/>
    </form>
    <Button type="blue"  disabled={!isValid}
            onClick={async () => {
              await newsStore.add();
              router.back();
            }}>опубликовать</Button>
  </>
}
