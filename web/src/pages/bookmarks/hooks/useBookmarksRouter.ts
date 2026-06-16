import { useRouter } from "../../routing";
import { getCurrentDay, getCurrentHour } from "@helpers/getDayText";
import { useEffect } from "preact/hooks";

export const useBookmarksRouter = () => {
  const router = useRouter<{ day: string; time: string }>();
  const type = (router.route[1] ?? "movie") as Bookmark["type"];
  const day = router.query.day ? +router.query.day : getCurrentDay();
  const time = router.query.time ? +router.query.time : getCurrentHour();

  const goToBookmarks = (
    bookmarkType: Bookmark["type"],
    query: Record<string, string>
  ) => router.goTo(["bookmarks", bookmarkType], query, true);

  const setDay = (newDay: number) => {
    const query: Record<string, string> = {
      day: newDay.toString(),
    };
    if (type === "activity") {
      query.time = time.toString();
    }
    goToBookmarks(type, query);
  };

  const setTime = (newTime: number) => {
    goToBookmarks(type, {
      day: day.toString(),
      time: newTime.toString(),
    });
  };

  useEffect(() => {
    if (!router.query.day) {
      const query: Record<string, string> = {
        day: getCurrentDay().toString(),
      };
      if (type === "activity") {
        query.time = getCurrentHour().toString();
      }
      goToBookmarks(type, query);
    } else if (type === "activity" && !router.query.time) {
      goToBookmarks(type, {
        day: router.query.day,
        time: getCurrentHour().toString(),
      });
    }
  }, [type, router.query.day, router.query.time]);

  return {
    ...router,
    type,
    day,
    time,
    setDay,
    setTime,
  };
};
