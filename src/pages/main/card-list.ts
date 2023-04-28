export const CardList: Array<CardInfo> = [{
  id: 'house',
  title: 'Жилье',
  color: true,
  section: Section.about,
  row: 1,
  col: 1
},{
  id: 'food',
  title: 'Еда',
  color: false,
  section: Section.about,
  row: 1,
  col: 2
},{
  id: 'water',
  title: 'Вода',
  color: false,
  section: Section.about,
  row: 1,
  col: 3
},

  {
    id: 'phone',
    title: 'Зарядить телефон',
    color: false,
    section: Section.about,
    row: 2,
    col: 1
  },
  {
    id: 'insight',
    title: 'Intronet Insomnia',
    color: true,
    section: Section.about,
    row: 2,
    col: 2
  },

]

export type CardInfo = {
  id: string;
  title: string;
  descr?: string;
  color: boolean;
  section: Section;
  row: number;
  col: number;
  colSpan?: number;
  rowSpan?: number;
};

export const enum Section{
  about,
  activity,
  warning,
  other
};

export const Sections = [{
  section: Section.about,
  title: 'О фестивале'
},{
  section: Section.activity,
  title: 'как тусим'
},{
  section: Section.warning,
  title: 'если чп'
},{
  section: Section.other,
  title: 'Тоже важное'
}]

