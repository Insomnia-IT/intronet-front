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
    <PageLayout gap={4} title={"Меню " + location.name} withCloseButton>
      <div style={{ whiteSpace: "pre" }} className="text">
        {location.menu}
      </div>
    </PageLayout>
  );
};
