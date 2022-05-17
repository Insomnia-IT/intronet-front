import React from "react";
import { Card, Columns, Heading, Icon, Image } from "react-bulma-components";

export function LocationList(props: LocationListProps) {
  return (
    <>
      {props.locations.map((x) => (
        <LocationItem
          key={x.id}
          onChange={props.onChange}
          onDelete={() => props.onDelete(x)}
          location={x}
        />
      ))}
    </>
  );
}

type LocationListProps = {
  locations: InsomniaLocationFull[];
  onChange(update: InsomniaLocationFull): void;
  onDelete(location: InsomniaLocationFull): void;
};

export function LocationItem(props: {
  location: InsomniaLocationFull;
  onChange(update: InsomniaLocationFull): void;
  onDelete(): void;
}) {
  return (
    <Card>
      <Card.Content>
        <Columns>
          <Columns.Column size={8}>
            <Image size={64} alt="64x64" src={props.location.image} />
          </Columns.Column>
          <Columns.Column>
            <Heading
              onInput={(e) =>
                props.onChange({
                  ...props.location,
                  name: e.target.textContent,
                })
              }
            >
              {props.location.name}
            </Heading>
            <Heading subtitle>
              {props.location.tags.map((x) => x.name).join(",")}
            </Heading>
          </Columns.Column>
          <Columns.Column size={1}>
            <Icon size="large" className="mdi mdi-arrow-down-bold"></Icon>
          </Columns.Column>
        </Columns>
      </Card.Content>
    </Card>
  );
}
