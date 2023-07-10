import { Form, Field, IFormField, IField } from "@components/forms";
import {
  namesShort as daysShortNames,
  getCurrentDay,
} from "@helpers/getDayText";
import styles from "./new-note-form.module.css";
import classNames from "classnames";
import { categoriesStore, notesStore } from "@stores";
import { useCell } from "@helpers/cell-state";
import { NextButton } from "../../NextButton/NextButton";
import { FunctionalComponent } from "preact";
import { authStore } from "@stores/auth.store";
import { useRouter } from "../../../../routing";
import { getCurrentDate } from "@helpers/date";

const dayTags = daysShortNames
  .map((day) => {
    if (Number(day.slice(3)) <= getCurrentDate()) {
      return;
    }

    return {
      name: "tag+" + day,
      value: day,
    };
  })
  .filter((x) => x);

const fields: INewNoteFormFields = [
  {
    name: "title",
    value: "",
    type: "input",
    require: true,
    description: "Максимум 35 символов",
    placeholder: "Привет, друзья!",
    lable: "Заголовок",
    maxLength: 35,
  },

  {
    name: "text",
    value: "",
    placeholder: "Давайте дружить, меня зовут...",
    description:
      "Тут уже можно разойтись, но помните, что краткость — сестра таланта (А.П. Чехов)",
    require: true,
    type: "textarea",
    lable: "Текст",
    maxLength: 300,
  },

  {
    name: "author",
    value: "",
    placeholder: "Александр Пушкин",
    require: true,
    lable: "Автор",
    type: "input",
    maxLength: 30,
  },

  {
    name: "category",
    value: "",
    lable: "Категория",
    type: "tags",
  },

  {
    name: "TTL",
    value: "",
    lable: "Актуально до",
    description: "В 00:00 выбранного дня удалим объявление",
    type: "tags",
    tags: dayTags,
  },
];

export type INewNoteFormProps = {
  onAddNote: (success: boolean) => void;
};

export const NewNoteForm: FunctionalComponent<INewNoteFormProps> = ({
  onAddNote,
}) => {
  const categories = useCell(() => categoriesStore.categories);
  const categoriesTags = categories.map(({ name, _id }) => {
    return {
      name: `tag+${_id}`,
      value: name,
    };
  });

  const router = useRouter();
  // TODO: нормально типизировать стейт формы
  const onSubmit = (formFields) => {
    notesStore
      .addNote({
        author: {
          name: isAdmin ? authStore.userName : (formFields["author"] as string),
        },
        categoryId: formFields["category"]?.slice("tag+".length) || "",
        text: formFields["text"] as string,
        title: formFields["title"] as string,
        TTL: isAdmin
          ? 18
          : (parseInt(formFields["TTL"].slice("tag+".length + 3)) as
              | 13
              | 14
              | 15
              | 16
              | 17) || 18,
        restricted: !isAdmin,
      })
      .then(() => {
        isAdmin ? router.goTo("/notes") : onAddNote(true);
      });
  };

  const isAdmin = useCell(() => authStore.isAdmin);

  const currentFields = isAdmin ? fields.slice(0, 2) : fields;

  const initialFormFields: IFormField[] = currentFields.map(
    ({ name, value, require }) => {
      return {
        name,
        value,
        require,
      };
    }
  );

  return (
    <Form
      initialFields={initialFormFields}
      onSubmit={onSubmit}
      className={styles.form}
    >
      {({ allReqFieldIsFill, state, onFieldChange, submit }) => {
        return (
          <>
            {currentFields.map((field) => {
              const { name } = field;
              return (
                <Field
                  {...field}
                  value={state[name]}
                  onChange={onFieldChange}
                  className={styles.field}
                  inputClassName={classNames({
                    [styles.textField]: name === "text",
                    [styles.tags]: name === "TTL",
                  })}
                  {...(name === "category"
                    ? {
                        tags: categoriesTags,
                      }
                    : {})}
                  key={name}
                />
              );
            })}
            <div className={styles.submitContainer}>
              <NextButton onClick={submit} disabled={!allReqFieldIsFill}>
                {isAdmin ? "Опубликовать" : "Отправить на модерацию"}
              </NextButton>
            </div>
          </>
        );
      }}
    </Form>
  );
};

type INewNoteFormFields = (IField & IFormField)[];
