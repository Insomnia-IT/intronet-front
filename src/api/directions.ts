import { AdminApi } from "./admin";
import { GenericRequest } from "./base";

const directionsRoute = "/api/directions";

// const adminDirectionsRoute = "/api/Admin/directions";
export enum Directions {
  fair = 2,
  lectures = 4,
  masterClass = 6,
  playground = 8,
  artObject = 10,
  meeting = 11,
  cafe = 12,
  tentRent = 13,
  info = 15,
  screen = 16,
  music = 20,
  staffCamp = 21,
  checkpoint = 22,
  camping = 81,
  bath = 83,
  wc = 85,
  fire = 86,
  bathhouse = 90,
  lab = 95,
}

export class DirectionsApi extends AdminApi {
  constructor() {
    super();
  }

  getDirection(
    request: GenericRequest<{ id: string }, null, null>
  ): Promise<Direction> {
    return this.fetch(`${directionsRoute}/${request.path.id}`);
  }

  getDirections(): Promise<Direction[]> {
    return this.fetch<Direction[]>(`${directionsRoute}/all`);
    // .then((x) =>
    // x.map((x) => ({ id: this.convert(x), name: x.name } as Direction))
    // );
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
