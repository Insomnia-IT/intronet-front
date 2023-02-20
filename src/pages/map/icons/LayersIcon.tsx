import React from "react";
import {Button} from "../../../components";

export const LayersIcon = (props: JSX.IntrinsicElements['svg']) => (
  <Button>
    <svg viewBox="0 0 24 24" width="24" height="24" {...props} enableBackground="1">
      <path
        fill="#808080"
        d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z"
      />
    </svg>
  </Button>
);
