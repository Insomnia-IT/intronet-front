import React from "react";
import {Location} from "../../../api/locations";
import {Card, Content, Heading, Media, Image} from "react-bulma-components";

export function LocationList(props: LocationListProps) {
  return <>
    {props.locations.map(x => <LocationItem key={x.id} location={x}/>)}
  </>;
}

type LocationListProps = {
  locations: Location[]
}

export function LocationItem(props: { location: Location }) {
  return  <Card>
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
          <Heading size={4}>{props.location.name}</Heading>
          <Heading subtitle size={6}>
            {props.location.tags}
          </Heading>
        </Media.Item>
      </Media>
    </Card.Content>
  </Card>;
}
