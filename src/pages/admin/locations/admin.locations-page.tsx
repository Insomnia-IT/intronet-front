import {adminApi} from "../../../api/admin";
import React from "react";

export function AdminLocationsPage(){
  if (!adminApi.isAdmin()) {
    location.pathname = '/login';
    return <></>;
  }
  return <>
    Welcome to admin locations page
  </>
}
