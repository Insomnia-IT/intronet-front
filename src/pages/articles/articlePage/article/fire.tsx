import {CloseButton} from "@components";

export const Fire = () => <div className="page" flex gap="4">
  <h1>Костры</h1>
  <CloseButton goTo="/main"/>
  <div class="text colorMediumBlue" flex column gap="4">
    <div>
      Сейчас в России действуют строгие правила пожарной безопасности. Если коротко: костры и мангалы нельзя :( На походные газовые горелки в этом законе прямого запрета нет.
    </div>
    <div>
      Если случилась беда — <b>подходите к волонтёрам с рацией</b>. На территории работают службы, которые помогут.
    </div>
  </div>
</div>;
