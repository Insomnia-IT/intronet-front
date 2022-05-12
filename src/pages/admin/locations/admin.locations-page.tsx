import {adminApi} from "../../../api/admin";
import React from "react";
import {cellState} from "../../../helpers/cell-state";
import {locationsStore} from "../../../stores/locations.store";
import {LocationList} from "./location.list";

export class AdminLocationsPage extends React.PureComponent {

  state = cellState(this, {
    locations: () => Array.from(locationsStore.Locations.values())
  });

  render() {
    if (!adminApi.isAdmin()) {
      location.pathname = '/login';
      return <></>;
    }
    return <>
      <LocationList locations={this.state.locations}/>
    </>
  }
}

