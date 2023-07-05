import { routes, useRouter } from "../../routing";

const baseRoute = "notes" as keyof typeof routes;

export const useNotesRouter = <TQuery extends Record<string, string>>() => {
  const router = useRouter<{
    filter: string;
  }>();

  return {
    ...router,
    section: router.route[1] as ISections | undefined,
    subSection: router.route[2] as ISubSections | undefined,
    filterId: router.query.filter,

    goToNote(id: string) {
      router.goTo([baseRoute, id]);
    },

    goToNotes(props?: IGoToNotes) {
      let filterQuery = {};

      if (props) {
        const { filterId } = props;

        if (filterId) {
          filterQuery = { filter: filterId };
        }
      }

      router.goTo([baseRoute], filterQuery, true);
    },

    goToNew(section?: ISubSections) {
      router.goTo([baseRoute, "new", section || "rules"], {}, true);
    },
  };
};

type IGoToNotes = {
  filterId: IFilter;
};

type IFilter = string;

export type ISections = "new" | "my" | "search" | "moderation";

export type ISubSections = "rules" | "editor" | "success" | "error";
