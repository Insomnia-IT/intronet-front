import { BookmarkPlug } from "@components/plugs/bookmark/BookmarkPlug";

export const BookmarkNotes = () => {
  // TODO: add notes
  const items = [];

  return (
    items.length > 0
      ? (<div flex column style={ 'gap: 24px' }>
        { items.map(item => <span>{ item }</span>) }
      </div>)
      : (<BookmarkPlug
        buttonTitle={ 'К объявлениям' }
        text={ [
          `Добавить объявления в избранное можно в разделе Объявления.`,
          `Нажмите на объявление в списке — откроется подробная информация и кнопка «Добавить в избранное».`,
        ] }
        route={ '/notes' }
      />)
  )
};
