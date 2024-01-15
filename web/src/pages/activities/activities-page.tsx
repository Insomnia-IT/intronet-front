import { useMemo } from "preact/hooks";
import { Button, ButtonsBar, CloseButton, Sheet } from "../../components";
import { SvgIcon } from "../../icons";
import { ActivitiesAll } from "./activities/activitiesAll";
import { Activity } from "./activity/activity";
import { ActivityEdit } from "./edit/activity-edit";
import { ActivitySearch } from "./search/activity-search";
import { useActivitiesRouter } from "./hooks/useActivitiesRouter";
import { routes } from "../routing";
import { ActivityLocation } from "./location/activityLocation";
import { PageLayout } from "@components/PageLayout";

export function ActivitiesPage() {
  const router = useActivitiesRouter();
  const sheets = useMemo(() => getActivitiesSheets(router.activityId, router.locationId), [ router.activityId, router.locationId ]);

  return (
    <PageLayout withTapBar>
      <ActivitiesAll/>
      <CloseButton onClick={ () => router.goTo([ 'main' ]) }/>
      <ButtonsBar at="bottom">
        <Button type="vivid" goTo={['activities','search',{}]}>
          <SvgIcon id="#search" size={ 15 } stroke-width={3}/>
        </Button>
        <Button type="vivid" goTo="/bookmarks/activity">
          <SvgIcon id="#bookmark" size="14px"/>
          Избранное
        </Button>
      </ButtonsBar>
      <Sheet children={sheets} onClose={() => router.goTo(['activities'])}/>
    </PageLayout>
  );
}

const baseRoute = "activities" as keyof typeof routes;

function getActivitiesSheets(activityId: string, locationId: string) {
  switch (activityId) {
    case "edit":
      return <>
        <ActivityEdit/>
        <CloseButton/>
      </>;
    case "location":
      return <>
        <ActivityLocation id={ locationId }/>
        <CloseButton/>
      </>;
    case "search":
      return <>
        <ActivitySearch/>
        <CloseButton/>
      </>;
    case undefined:
      return null;
    default:
      return <>
        <Activity id={ activityId }/>
        <CloseButton/>
      </>;
  }
}
