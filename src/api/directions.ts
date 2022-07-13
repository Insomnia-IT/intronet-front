import { AdminApi } from "./admin";
import { GenericRequest } from "./base";

const directionsRoute = "/api/directions";
// const adminDirectionsRoute = "/api/Admin/directions";

export class DirectionsApi extends AdminApi {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  getDirection(
    request: GenericRequest<{ id: string }, null, null>
  ): Promise<Direction> {
    return this.fetch(`${directionsRoute}/${request.path.id}`);
  }

  getDirections(): Promise<Direction[]> {
    return this.fetch(`${directionsRoute}/all`);
  }
  //
  // createDirection(
  //   request: GenericRequest<
  //     null,
  //     null,
  //     {
  //       name: string;
  //       image: string;
  //       file: File;
  //     }
  //   >
  // ): Promise<null> {
  //   return this.adminFetch(`${adminDirectionsRoute}/add`, {
  //     method: "POST",
  //     body: JSON.stringify(request.body),
  //   });
  // }
  //
  // editDirection(
  //   request: GenericRequest<
  //     null,
  //     null,
  //     {
  //       id: number;
  //       name?: string;
  //       image?: string;
  //       file?: File;
  //     }
  //   >
  // ): Promise<null> {
  //   return this.adminFetch(`${adminDirectionsRoute}/edit`, {
  //     method: "PUT",
  //     body: JSON.stringify(request.body),
  //   });
  // }
  //
  // deleteDirection(directionId: number): Promise<null> {
  //   if (directionId === 1) return;
  //   return this.adminFetch(`${adminDirectionsRoute}/delete/${directionId}`, {
  //     method: "DELETE",
  //   });
  // }
}
