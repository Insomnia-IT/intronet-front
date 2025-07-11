import { FunctionalComponent } from "preact";
import { PageLayout } from "@components";
import { locationsStore } from "@stores";
import { useCell } from "@helpers/cell-state";

export type LocationSmallProps = {
  id: string;
};

export const LocationMenu: FunctionalComponent<LocationSmallProps> = ({
  id,
}) => {
  const location = useCell(() =>
    locationsStore.Locations.find((x) => x._id == id)
  );
  if (!location) return <></>;
  return (
    <PageLayout gap={4} title={location.name} withCloseButton>
      <div className="sh2">Меню</div>
      <div style={{ whiteSpace: "pre-wrap" }} className="text">
        {location.menu}
      </div>
    </PageLayout>
  );
};
