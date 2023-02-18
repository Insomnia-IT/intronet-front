import { cell } from "@cmmn/cell/lib";
import { Directions } from "./locations.store";
import { ObservableDB } from "./observableDB";

class DirectionsStore {

  @cell
  Directions = new ObservableDB<Direction>("directions");

  @cell
  IsLoading: boolean = false;

  get isLoading() {
    return this.IsLoading;
  }

  toggleLoading = () => {
    this.IsLoading = !this.isLoading;
  };

  constructor() {
    this.getAll();
  }

  /**
   * Возвращает список картинок для локаций
   */
  public async getAll(): Promise<Direction[]> {
    await this.Directions.isLoaded;
    return this.Directions.toArray();
  }

  /**
   * Добавляет картинку-направление
   */
  // public addDirection = async (
  //   request: GenericRequest<
  //     null,
  //     null,
  //     {
  //       name: string;
  //       image: string;
  //       file: File;
  //     }
  //   >
  // ) => {
  //   try {
  //     this.IsLoading = true;
  //     await this.api.createDirection(request);
  //     this.getAll();
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     this.IsLoading = false;
  //   }
  // };

  /**
   * Изменяет картинку-направление
   */
  // public editDirection = async (
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
  // ) => {
  //   try {
  //     this.IsLoading = true;
  //     await this.api.editDirection(request);
  //     const { file, ...direction } = request.body;
  //     this.Directions.update(direction as Exclude<Direction, "undefined">);
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     this.IsLoading = false;
  //   }
  // };
  //
  // /**
  //  * Удаляет картинку-направление
  //  */
  // public removeNote = async (
  //   request: GenericRequest<{ id: number }, null, null>
  // ) => {
  //   try {
  //     this.IsLoading = true;
  //     await this.api.deleteDirection(request);
  //     this.Directions.remove(request.path.id);
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     this.IsLoading = false;
  //   }
  // };

  public DirectionToDirection(id: string): Directions {
    const x = this.Directions.get(id);
    switch (x?.name) {
      case "Затмение":
        return Directions.artObject;
      case "Ярмарка":
        return Directions.fair;
      case "Лекторий":
        return Directions.lectures;
      case "Хатифнатты":
        return Directions.lectures;
      case "Мастер-классы":
        return Directions.lectures;
      case "locus":
        return Directions.cafe;
      case "Кафе":
        return Directions.cafe;
      case "Детская площадка":
        return Directions.playground;
      case "Арт-объект":
        return Directions.artObject;
      case "Точка сборки":
        return Directions.meeting;
      case "Платный лагерь":
        return Directions.camping;
      case "Инфоцентр":
        return Directions.info;
      case "АниматорSKYа":
        return Directions.lectures;
      case "Альпинист":
        return Directions.artObject;
      case "Экран":
        return Directions.screen;
      case "Медлокация":
        return Directions.meeting;
      case "Музыкальная сцена":
        return Directions.music;
      case "ШТАБ":
        return Directions.staffCamp;
      case "КПП":
        return Directions.checkpoint;
      case "Парковка":
        return Directions.checkpoint;
      case "Костер":
      case "Костёр":
        return Directions.fire;
      case "":
      case "Туалет":
      case "WC":
        return Directions.wc;
      case "Душ":
        return Directions.bath;
      case "Баня":
        return Directions.bathhouse;
      case "Прокат палаток":
        return Directions.tentRent;
      default:
        return null;
    }
  }
}

export const directionsStore = new DirectionsStore();
