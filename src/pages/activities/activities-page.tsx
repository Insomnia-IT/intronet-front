import { Button, ButtonsBar, CloseButton } from "@components";
import style from "../../app/app.style.module.css";
import { SvgIcon } from "@icons";
import { ActivitiesAll } from "./activities/activitiesAll";
import { Activity } from "./activity/activity";
import { ActivitySearch } from "./search/activity-search";
import { useActivitiesRouter } from "./hooks/useActivitiesRouter";

export function ActivitiesPage() {
  const router = useActivitiesRouter();
  switch (router.activityId) {
    case "search":
      return (
        <div class="page">
          <ActivitySearch />
          <CloseButton />
        </div>
      );
    case undefined:
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
        </div>
      );
    default:
      return (
        <div class="page">
          <Activity id={router.activityId} />
          <CloseButton />
        </div>
      );
  }
}
