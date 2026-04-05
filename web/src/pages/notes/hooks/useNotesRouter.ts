import { routes, useRouter } from "../../routing";
import {authStore} from "../../../stores/auth.store";
import { useCallback } from "preact/hooks";

const baseRoute = "notes" as keyof typeof routes;

export const useNotesRouter = <TQuery extends Record<string, string>>() => {
  const router = useRouter<{
    filter: string;
  }>();

  const goToNote = useCallback((id: string) => {
    router.goTo([baseRoute, id]);
  }, []);

  const goToNotes = useCallback((props?: IGoToNotes) => {
    let filterQuery = {};

    if (props) {
      const { filterId } = props;

      if (filterId) {
        filterQuery = { filter: filterId };
      }
    }

    router.goTo([baseRoute], filterQuery, true);
  }, []);

  const goToNew = useCallback((section?: ISubSections) => {
    const isAdmin = authStore.isAdmin;
    router.goTo([baseRoute, "new", section || (isAdmin ? "editor" : "rules")], {}, true);
  }, []);

  return {
    ...router,
    section: router.route[1] as ISections | undefined,
    subSection: router.route[2] as ISubSections | undefined,
    filterId: router.query.filter,
    goToNote,
    goToNotes,
    goToNew,
  };
};

type IGoToNotes = {
  filterId: IFilter;
};

type IFilter = string;

export type ISections = "new" | "my" | "search" | "moderation";

export type ISubSections = "rules" | "editor" | "success" | "error";
