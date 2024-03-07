import { Fragment } from "preact";
import { useMemo } from "preact/hooks";
import { PageLayout } from "@components/PageLayout";
import { Button, CloseButton, Sheet } from "../../components";
import { SvgIcon } from "../../icons";
import { ActivitiesAll } from "./activities/activitiesAll";
import { Activity } from "./activity/activity";
import { ActivityEdit } from "./edit/activity-edit";
import { ActivitySearch } from "./search/activity-search";
import { useActivitiesRouter } from "./hooks/useActivitiesRouter";
import { routes } from "../routing";
import { ActivityLocation } from "./location/activityLocation";

export function ActivitiesPage() {
  const router = useActivitiesRouter();
  const sheets = useMemo(
    () => getActivitiesSheets(router.activityId, router.locationId),
    [router.activityId, router.locationId]
  );

  return (
    <PageLayout
      title="Неанимация"
      favoritesRoute="/bookmarks/activity"
      search={ActivitySearch}
      hideSearchDeps={[router.locationId, router.activityId]}
      searchLabel="Мастер-классы, лекции..."
      withTapBar
    >
      <ActivitiesAll />
      <Sheet children={sheets} onClose={() => router.goTo(["activities"])} />
    </PageLayout>
  );
}

const baseRoute = "activities" as keyof typeof routes;

function getActivitiesSheets(activityId: string, locationId: string) {
  switch (activityId) {
    case "edit":
      return (
        <>
          <ActivityEdit />
          <CloseButton />
        </>
      );
    case "location":
      return (
        <>
          <ActivityLocation id={locationId} />
          <CloseButton />
        </>
      );
    case "search":
      return (
        <>
          <ActivitySearch />
          <CloseButton />
        </>
      );
    case undefined:
      return null;
    default:
      return (
        <>
          <Activity id={activityId} />
          <CloseButton />
        </>
      );
  }
}
