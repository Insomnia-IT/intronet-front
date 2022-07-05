import { Observable } from "cellx-decorators";
import { GenericRequest } from "src/api/base";
import { DirectionsApi } from "src/api/directions";
import { ObservableDB } from "./observableDB";

class DirectionsStore {
  private api = new DirectionsApi();

  @Observable
  Directions = new ObservableDB<Direction>("directions");

  @Observable
  IsLoading: boolean = false;

  get isLoading() {
    return this.IsLoading;
  }

  toggleLoading = () => {
    this.IsLoading = !this.isLoading;
  };
  //
  // constructor() {
  //   Object.keys(MapIcons).forEach((key) => {
  //     this.api.createDirection({
  //       body: {
  //         name: key,
  //         file: null,
  //         image: "",
  //       },
  //     });
  //   });
  // }

  /**
   * Возвращает список картинок для локаций
   */
  public async getAll() {
    this.IsLoading = true;
    try {
      const directions = await this.api.getDirections();
      this.Directions.clear();
      this.Directions.addRange(directions);
    } catch (error) {
      throw error;
    } finally {
      this.IsLoading = false;
    }
  }

  /**
   * Добавляет картинку-направление
   */
  public addDirection = async (
    request: GenericRequest<
      null,
      null,
      {
        name: string;
        image: string;
        file: File;
      }
    >
  ) => {
    try {
      this.IsLoading = true;
      await this.api.createDirection(request);
      this.getAll();
    } catch (error) {
      throw error;
    } finally {
      this.IsLoading = false;
    }
  };

  /**
   * Изменяет картинку-направление
   */
  public editDirection = async (
    request: GenericRequest<
      null,
      null,
      {
        id: number;
        name?: string;
        image?: string;
        file?: File;
      }
    >
  ) => {
    try {
      this.IsLoading = true;
      await this.api.editDirection(request);
      const { file, ...direction } = request.body;
      this.Directions.update(direction as Exclude<Direction, "undefined">);
    } catch (error) {
      throw error;
    } finally {
      this.IsLoading = false;
    }
  };

  /**
   * Удаляет картинку-направление
   */
  public removeNote = async (
    request: GenericRequest<{ id: number }, null, null>
  ) => {
    try {
      this.IsLoading = true;
      await this.api.deleteDirection(request);
      this.Directions.remove(request.path.id);
    } catch (error) {
      throw error;
    } finally {
      this.IsLoading = false;
    }
  };
}

export const directionsStore = new DirectionsStore();
