import { RoutePath, RoutePathString, routes, useRouter } from "../../routing";

const baseRoute = "activities" as keyof typeof routes;
export const useActivitiesRouter = <TQuery extends Record<string, string>>() => {
  const router = useRouter<{
    filter: string;
    day: string;
    place: string;
    time: string;
  }>();

  return {
    ...router,
    activityId: router.route[1] as string | undefined,
    locationId: router.route[2] as string | undefined,
    filter: router.query.filter,
    day: router.query.day,
    place: router.query.place,
    time: router.query.time,

    goToActivity(id: string) {
      router.goTo([baseRoute, id]);
    },

    goToLocations() {
      router.goTo([baseRoute, 'location']);
    },

    goToLocationActivity(id: string, props?: IActivityQueries) {
      let filterQuery = {};

      if (props) {
        filterQuery = {...filterQuery, ...props};

        if (isActivityQueries(filterQuery)) {
          filterQuery = mapToActivityPlaceQueries(filterQuery);
        }
      }

      router.goTo([baseRoute, 'location', id], filterQuery, true);
    },

    goToActivities(props?: IActivityQueries) {
      let filterQuery = {};

      if (props) {
        filterQuery = {...filterQuery, ...props};

        if (isActivityQueries(filterQuery)) {
          filterQuery = filterQuery.filter === 'time' ? mapToActivityTimeQueries(filterQuery) : mapToActivityPlaceQueries(filterQuery);
        }
      }

      router.goTo(props.path ? [ baseRoute, ...props.path ] : [ baseRoute ], filterQuery, true);
    },
  };
};

export interface IActivityQueries {
  filter: string;
  day: string;
  place?: string;
  time?: string;
  path?: string[],
}

type IActivityTimeQueries = Omit<IActivityQueries, 'place'>;

const mapToActivityTimeQueries = ({filter, day, time}: IActivityQueries): IActivityTimeQueries => ({
  filter,
  day,
  time
});

const mapToActivityPlaceQueries = ({filter, day, place, time}: IActivityQueries): IActivityQueries => ({
  filter,
  day,
  place,
  time
});

const isActivityQueries = (prop: unknown): prop is IActivityQueries => {
  return prop.hasOwnProperty('filter') && prop.hasOwnProperty('day');
}

export type ActivityFilterType = "time" | "place";

