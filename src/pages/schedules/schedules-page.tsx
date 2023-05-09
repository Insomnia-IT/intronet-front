import { Button, ButtonsBar, CloseButton } from "@components";
import { routes, useRouter } from "../routing";
import style from "../../app/app.style.module.css";
import { SvgIcon } from "@icons";
import { EventAll } from "./events/eventAll";
import { Event } from "./event/event";

export function SchedulesPage() {
  const router = useSchedulesRouter();
  switch (router.eventId) {
    case "search":
      return (
        <div class="page">
          {/*<MovieSearch />*/}
          <CloseButton />
        </div>
      );
    case undefined:
      return (
        <div class="page">
          <EventAll />
          <CloseButton />
          <ButtonsBar at="bottom">
            <Button type="vivid" goTo="/timetable/search">
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
          <Event id={router.eventId} />
          <CloseButton />
        </div>
      );
  }
}

const baseRoute = "schedules" as keyof typeof routes;
export function useSchedulesRouter() {
  const router = useRouter();
  return {
    ...router,
    eventId: router.route[1] as string | undefined,
    goToEvent(id: string) {
      router.goTo([baseRoute, id]);
    },
  };
}
