import { Button, ButtonsBar, CloseButton } from "@components";
import { routes, useRouter } from "../routing";
import style from "../../app/app.style.module.css";
import { SvgIcon } from "@icons";
import { ActivitiesAll } from "./activities/activitiesAll";
import { Activity } from "./activity/activity";
import { ActivitySearch } from "./search/activity-search";

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
            <Button type="vivid" goTo="/bookmarks/movie">
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

const baseRoute = "activities" as keyof typeof routes;
export function useActivitiesRouter() {
  const router = useRouter();
  return {
    ...router,
    activityId: router.route[1] as string | undefined,
    goToActivity(id: string) {
      router.goTo([baseRoute, id]);
    },
  };
}
