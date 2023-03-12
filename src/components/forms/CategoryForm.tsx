import React, { FC } from "preact/compat";

export type CategoryFormProps = {
  onSubmit?: (category: ICategory) => void;
  onCancel?: () => void;
} & { category?: ICategory };

const colors = [
  {color: "#6bbdb0", name: "Зелененький"},
  {color: "#ffb746", name: "Жельтенький"},
  {color: "#44b8ff", name: "Синенький"},
  {color: "#9880f1", name: "Фиолетовенький"},
  {color: "#cbd5e0", name: "Серенький"},
  {color: "#e57287", name: "Розовенький"},
];

export const CategoryForm: FC<CategoryFormProps> = ({
                                                      category,
                                                      onSubmit,
                                                      onCancel,
                                                    }) => {
  return (
    <form onSubmit={ () => onSubmit(category) }>
      <label htmlFor="name">Наименование</label>
      <input id="name"/>

      <section className="form-body">
        <button onClick={ onCancel }>
          Отменить
        </button>

        <button type="submit">
          Сохранить
        </button>
      </section>
    </form>
  );
};
