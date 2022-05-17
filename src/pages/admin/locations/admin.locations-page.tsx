import {adminApi} from "../../../api/admin";
import React from "react";
import {cellState} from "../../../helpers/cell-state";
import {locationsStore} from "../../../stores/locations.store";
import {LocationList} from "./location.list";
import {Observable} from "cellx-decorators";
import {Form, Icon} from "react-bulma-components";

export class AdminLocationsPage extends React.PureComponent {

  @Observable
  filter = '';

  state = cellState(this, {
    locations: () => locationsStore.FullLocations.filter(x => x.name.includes(this.filter)),
    filter: () => this.filter
  });

  render() {
    // if (!adminApi.isAdmin()) {
    //   location.pathname = '/login';
    //   return <></>;
    // }
    return <>
      <Form.Field>
        <Form.Control>
          <Form.Input type="text" value={this.state.filter}
                      placeholder="search"
                      onChange={e => this.filter = e.currentTarget.value}/>
          <Icon align="left">
            <i className="mdi mdi-search-web" />
          </Icon>
        </Form.Control>
      </Form.Field>
      <LocationList locations={this.state.locations}
                    onChange={x => locationsStore.updateLocation(x)}
                    onDelete={x => locationsStore.deleteLocation(x)}/>
    </>
  }
}

