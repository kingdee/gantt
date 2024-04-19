/*
 * @Author: jianhang_he jianhang_he@kingdee.com
 * @Date: 2024-02-20 16:05:14
 * @LastEditors: jianhang_he jianhang_he@kingdee.com
 * @LastEditTime: 2024-03-20 14:38:06
 * @FilePath: \gantt-task-react\src\components\task-item\milestone\milestone.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from "react";
import { TaskItemProps } from "../task-item";
import styles from "./milestone.module.css";

export const Milestone: React.FC<TaskItemProps> = ({
  // task,
  // isDateChangeable,
  // onEventStart,
  // isSelected,
  taskItemConfig
}) => {
  const taskHeight = 15
  const transform = `rotate(45 ${taskItemConfig.x1 + taskHeight * 0.356} 
    ${taskItemConfig.y + taskHeight * 0.85})`;
  // const getBarColor = () => {
  //   return isSelected
  //     ? taskItemConfig.styles.backgroundSelectedColor
  //     : taskItemConfig.styles.backgroundColor;
  // };

  return (
    <g tabIndex={0} className={styles.milestoneWrapper}>
      <rect
        fill={taskItemConfig.styles.backgroundColor}
        x={taskItemConfig.x1}
        width={taskHeight}
        y={taskItemConfig.y}
        height={taskHeight}
        // rx={2}
        // ry={2}
        transform={transform}
        className={styles.milestoneBackground}
        // onMouseDown={e => {
        //   isDateChangeable && onEventStart("move", task, e);
        // }}
      />
    </g>
  );
};
