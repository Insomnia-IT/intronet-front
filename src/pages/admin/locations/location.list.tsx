import React from "react";
import {Card, Heading, Image, Media} from "react-bulma-components";
import {LocationFull} from "../../../stores/locations.store";

export function LocationList(props: LocationListProps) {
  return <>
    {props.locations.map(x => <LocationItem key={x.id}
                                            onChange={props.onChange}
                                            location={x}/>)}
  </>;
}

type LocationListProps = {
  locations: LocationFull[]
  onChange(update: LocationFull): void;
}

export function LocationItem(props: {
  location: LocationFull,
  onChange(update: LocationFull): void;
}) {
  return <Card>
    <Card.Content>
      <Media>
        <Media.Item renderAs="figure" align="left">
          <Image
            size={64}
            alt="64x64"
            src={props.location.image}
          />
        </Media.Item>
        <Media.Item>
          <Heading contentEditable onInput={e => props.onChange({
            ...props.location,
            name: e.target.textContent
          })}>{props.location.name}</Heading>
          <Heading subtitle size={6}>
            {props.location.tags.map(x => x.name).join(',')}
          </Heading>
        </Media.Item>
      </Media>
    </Card.Content>
  </Card>;
}
