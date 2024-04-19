import React from "react";
// import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
// import { BarDateHandle } from "./bar-date-handle";
// import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const Bar: React.FC<TaskItemProps> = ({
  task,
  // isProgressChangeable,
  isDateChangeable,
  // rtl,
  onEventStart,
  isSelected,
  taskItemConfig
}) => {
  // const progressPoint = getProgressPoint(
  //   +!rtl * taskItemConfig.progressWidth + taskItemConfig.progressX,
  //   task.y,
  //   task.height
  // );
  // const handleHeight = task.height - 2;

  const barDisplaystyles = { ...task.styles, ...taskItemConfig.styles}
  // console.log('styles', taskItemConfig, barDisplaystyles, task.styles, taskItemConfig.styles)

  const _width = taskItemConfig.x2 - taskItemConfig.x1

  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={taskItemConfig.x1}
        y={taskItemConfig.y}
        width={_width > 0 ? _width : 0}
        height={taskItemConfig.height}
        progressX={taskItemConfig.progressX}
        progressWidth={taskItemConfig.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={barDisplaystyles}
        isSelected={isSelected}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      {/* <g className="handleGroup">
        {isDateChangeable && (
          <g>
            <BarDateHandle
              x={taskItemConfig.x1 + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("start", task, e, taskItemConfig);
              }}
            />
            <BarDateHandle
              x={taskItemConfig.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("end", task, e, taskItemConfig);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g> */}
    </g>
  );
};
