import {AdminApi} from "./admin";

const adminRoute = `/api/Admin/locations`
const adminTagRoute = `/api/Admin/tags`

export class LocationsApi extends AdminApi {

  public addLocation(location: Omit<Location, "id">) {
    return this.adminFetch(`${adminRoute}/add`, {
      method: 'POST',
      body: JSON.stringify(location)
    });
  }


  public updateLocation(location: Partial<Location> & Pick<Location, "id">) {
    return this.adminFetch(`${adminRoute}/add`, {
      method: 'PUT',
      body: JSON.stringify(location)
    });
  }

  public deleteLocation(id: number) {
    return this.adminFetch(`${adminRoute}/delete/${id}`, {
      method: 'DELETE',
    });
  }

  public getTags(): Promise<Tag[]> {
    return this.fetch('/api/tags/all')
  }

  public addTag(name: string) {
    return this.adminFetch(`${adminTagRoute}/add`, {
      method: 'POST',
      body: JSON.stringify({Name: name})
    })
  }

  public updateTag(tag: Tag) {
    return this.adminFetch(`${adminTagRoute}/add`, {
      method: 'PUT',
      body: JSON.stringify(tag)
    })
  }

  public deleteTag(id: number) {
    return this.adminFetch(`${adminTagRoute}/delete/${id}`, {
      method: 'DELETE',
    });
  }

  public updateTagPicture(tag: Tag, picture: Blob) {
    const data = new FormData();
    data.append('Id', tag.id.toString());
    data.append('File', picture);
    return this.adminFetch(`${adminTagRoute}/add`, {
      method: 'POST',
      body: data
    });
  }
}

export type Tag = {
  id: number;
  name: string;
}

export type Location = {
  id: number;
  name: string;
  x: number;
  y: number;
  tags: number[];
  image: string;
}
