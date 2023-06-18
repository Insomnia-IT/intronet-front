import { Button, ButtonsBar, CloseButton, Sheet } from "@components";
import style from "../../app/app.style.module.css";
import { SvgIcon } from "@icons";
import { ActivitiesAll } from "./activities/activitiesAll";
import { Activity } from "./activity/activity";
import { ActivitySearch } from "./search/activity-search";
import { useActivitiesRouter } from "./hooks/useActivitiesRouter";
import { useMemo } from "preact/hooks";
import { routes } from "../routing";

export function ActivitiesPage() {
  const router = useActivitiesRouter();
  const sheets = useMemo(() => getActivitiesSheets(router.activityId), [router.activityId]);

  return (
    <div class="page">
      <ActivitiesAll />
      <CloseButton />
      <ButtonsBar at="bottom">
        <Button type="vivid" goTo="/activities/search">
          <SvgIcon id="#search" size={15} />
        </Button>
        <Button type="vivid" goTo="/bookmarks/activity">
          <SvgIcon id="#bookmark" size="14px" />
          Избранное
        </Button>
      </ButtonsBar>
      <Sheet children={sheets} onClose={() => router.goTo([baseRoute])}/>
    </div>
  );
}

const baseRoute = "activities" as keyof typeof routes;

function getActivitiesSheets(activityId: string){
  switch (activityId) {
    case "search":
      return <>
        <ActivitySearch />
        <CloseButton/>
      </>;
    case undefined:
      return null;
    default:
      return <>
        <Activity id={activityId} />
        <CloseButton/>
      </>;
  }
}
