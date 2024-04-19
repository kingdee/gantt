import React from "react";
import { GridBody, GridBodyProps, GridBodyToday } from "./grid-body";

export const GridToday = GridBodyToday
export type GridProps = GridBodyProps;
export const Grid: React.FC<GridProps> = props => {
  return (
    <g className="grid">
      <GridBody {...props} />
    </g>
  );
};
