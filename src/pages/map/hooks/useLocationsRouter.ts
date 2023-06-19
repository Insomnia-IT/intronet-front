import { routes, useRouter } from "../../routing";

const baseRoute = "map" as keyof typeof routes;
export const useLocationsRouter = <TQuery extends Record<string, string>>() => {
  const router = useRouter<{
    name: string;
  }>();

  return {
    ...router,
    locationId: router.route[1] as string | undefined,
    name: router.query.name,

    goToLocation(id: string) {
      router.goTo([baseRoute, id]);
    }
  };
};


