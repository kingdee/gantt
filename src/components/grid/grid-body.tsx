import React, { ReactChild } from "react";
import { Task } from "../../types/public-types";
import { getTodayXByTimeMode, getDateColumnWidthByViewMode, getDateIsActive } from "../../helpers/date-helper";
import { calcRowTaskHeight, calcRowTaskY } from "../../helpers/bar-helper";
import styles from "./grid.module.css";
import {
  GanttEvent,
  GanttContentMoveAction
} from "../../types/gantt-task-actions";
import classnames from 'classnames'
// import { BarTask } from "../../types/bar-task";
import { ViewMode } from "../../types/public-types";

export type GridBodyProps = {
  viewMode?: ViewMode;
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
  rowCount?: number;
  ganttFullHeight?: number;
  ganttEvent: GanttEvent;
  setGanttEvent: (value: GanttEvent) => void;
};
export const GridBody: React.FC<GridBodyProps> = ({
  viewMode = ViewMode.Day,
  tasks,
  dates,
  // rowHeight,
  svgWidth,
  // columnWidth,
  // todayColor,
  // rtl,
  ganttFullHeight = 0,
  ganttEvent,
  setGanttEvent
}) => {
  const onEventStart = (
    action: GanttContentMoveAction,
    task: any,
    event?: React.MouseEvent
  ) => {
    if (action === "row_mouseenter") {
      if (!ganttEvent.action || ganttEvent.action === 'row_mouseenter') {
        setTimeout(() => {
          setGanttEvent({
            action,
            hoverTask: task,
            event
          });
        })
      }
    } else if (action === "row_mouseleave") {
      if (ganttEvent.action === "row_mouseenter" && ganttEvent.hoverTask?.id === task.id) {
        setGanttEvent({ action: "", hoverTask: undefined });
      }
    }
  }

  let y = 0;
  const gridRows: ReactChild[] = [];
  // const rowLines: ReactChild[] = [
  //   <line
  //     key="RowLineFirst"
  //     x="0"
  //     y1={0}
  //     x2={svgWidth}
  //     y2={0}
  //     className={styles.gridRowLine}
  //   />,
  // ];

  let lastTaskRowHeight = 0

  tasks.forEach((task, index) => {
    const taskItemCount = task.taskItems?.length || 1
    const height = calcRowTaskHeight(20, taskItemCount, 12, 12)

    if(index === tasks.length - 1) {
      lastTaskRowHeight = height
    }

    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={height}
        className={classnames(styles.gridRow, {
          [styles.gridRow_hover]: task.id === ganttEvent.hoverTask?.id
        })}
        onMouseEnter={(e: React.MouseEvent) => {
          e.persist()
          onEventStart("row_mouseenter", task, e);
        }}
        onMouseLeave={(e: React.MouseEvent) => {
          e.persist()
          onEventStart("row_mouseleave", task, e);
        }}
      />
    );
    y = calcRowTaskY(y, 20, taskItemCount, 12, 12);
  })

  let tickX = 0;
  const ticks: ReactChild[] = [];
  // const lastRowTask = tasks[tasks.length -1] || { y: 0, height: 44 }

  const ganttTasksHeight =  y + lastTaskRowHeight
  const _y = ganttFullHeight > ganttTasksHeight ? ganttFullHeight : ganttTasksHeight
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={_y}
        className={styles.gridTick}
      />
    );

    // 周末日
    // if(date.getDay() === 6 || date.getDay() === 7) {
    //   ticks.push(
    //     <rect
    //       key={'weekend' + date.getTime()}
    //       x={tickX}
    //       y={0}
    //       width={44}
    //       height={_y}
    //       fill='#FAFAFA'
    //     />
    //   )
    // }

    tickX += (getDateColumnWidthByViewMode(viewMode, date));
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      {/* <g className="rowLines">{rowLines}</g> */}
      <g className="ticks">{ticks}</g>
      {/* <g className="today">{today}</g> */}
    </g>
  );
};

export const GridBodyToday: React.FC<GridBodyProps> = ({
  viewMode = ViewMode.Day,
  tasks,
  dates,
  // columnWidth,
  // todayColor,
  // // rowHeight,
  // rtl,
  ganttFullHeight = 0
}) => {
  let y = 0;

  for (const task of tasks) {
    const taskItemCount = task.taskItems?.length || 1
    y = calcRowTaskY(y, 20, taskItemCount, 12, 12);
  }

  const _y = ganttFullHeight > y ? ganttFullHeight : y

  // const now = new Date();
  let tickX = 0;
  let today: ReactChild = <rect />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    if (
      getDateIsActive(date, viewMode)) {
      today = (
        <rect
          x={tickX + getTodayXByTimeMode(viewMode)}
          y={0}
          width={1}
          height={_y}
          fill='#FF5F1F'
        />
      );
    }
    tickX += (getDateColumnWidthByViewMode(viewMode, date));
  }
  return (
    <g className="today">{today}</g>
  );
}
