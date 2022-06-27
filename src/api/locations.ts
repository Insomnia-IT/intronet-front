import { useCallback, useEffect, useState } from "react";
import { debounced } from "src/helpers/debounce";
import { locationsStore } from "src/stores/locations.store";
import { AdminApi } from "./admin";

const adminRoute = `/api/Admin/locations`;
const adminTagRoute = `/api/Admin/tags`;

export class LocationsApi extends AdminApi {
  public addLocation(location: Omit<InsomniaLocation, "id">) {
    return this.adminFetch(`${adminRoute}/add`, {
      method: "POST",
      body: JSON.stringify(location),
    });
  }

  public async getLocations(): Promise<InsomniaLocation[]> {
    const loc = await this.fetch<InsomniaLocationFull[]>(
      "/api/Locations/all/full"
    );
    return loc.map((x) => ({
      ...x,
      direction: undefined,
      timetables: undefined,
      tags: x.tags.map((x) => x.id),
    })) as InsomniaLocation[];
  }

  public updateLocation(
    location: Partial<InsomniaLocation> & Pick<InsomniaLocation, "id">
  ) {
    return this.adminFetch(`${adminRoute}/edit`, {
      method: "PUT",
      body: JSON.stringify(location),
    });
  }

  public deleteLocation(id: number) {
    return this.adminFetch(`${adminRoute}/delete/${id}`, {
      method: "DELETE",
    });
  }

  public getTags(): Promise<Tag[]> {
    return this.fetch("/api/tags/all");
  }

  public addTag(name: string) {
    return this.adminFetch(`${adminTagRoute}/add`, {
      method: "POST",
      body: JSON.stringify({ Name: name }),
    });
  }

  public updateTag(tag: Tag) {
    return this.adminFetch(`${adminTagRoute}/edit`, {
      method: "PUT",
      body: JSON.stringify(tag),
    });
  }

  public deleteTag(id: number) {
    return this.adminFetch(`${adminTagRoute}/delete/${id}`, {
      method: "DELETE",
    });
  }

  public updateTagPicture(tag: Tag, picture: Blob) {
    const data = new FormData();
    data.append("Id", tag.id.toString());
    data.append("File", picture);
    return this.adminFetch(`${adminTagRoute}/add`, {
      method: "POST",
      body: data,
    });
  }
}
