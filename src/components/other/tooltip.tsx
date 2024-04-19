import React, { useRef, useEffect, useState } from "react";
import ReactDOM from 'react-dom'
import { Task } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import { formatDate, getDaysBetweenDates } from '../../helpers/date-helper'
// import usePopper from "../../helpers/usePoper";
import DropDownPanel from './dropdown-panel'
// import { Tooltip as BaseTooltip } from '@kdcloudjs/kdesign'

import styles from "./tooltip.module.css";

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  mouseEvent: React.MouseEvent;
  TooltipContent: React.FC<{
    task: Task;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  task,
  // rowHeight,
  // rtl,
  // svgContainerHeight,
  // svgContainerWidth,
  // scrollX,
  // scrollY,
  // arrowIndent,
  // headerHeight,
  // taskListWidth,
  TooltipContent,
  mouseEvent
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    if (tooltipRef.current) {
      const { clientX, clientY } = mouseEvent || { clientX: 0, clientY: 0 }

      tooltipRef.current.style.cssText += `;left: ${clientX}px;top: ${clientY}px;`
    }
  }, [
    task.id
  ]);

  useEffect(() => {
    setVisible(!!task.taskItems?.length)
  }, [task.id])

  return ReactDOM.createPortal(
    <div ref={tooltipRef} className={styles.tooltip}>
      <DropDownPanel
        scrollHidden
        popperClassName={styles.tooltip_content}
        visible={visible}
        onVisibleChange={(visible: boolean) => setVisible(visible)}
        placement='bottomLeft'
        content={(
          <TooltipContent task={task} />
        )}
      />
    </div>,
    document.body
  )
};

export const StandardTooltipContent: React.FC<{
  task: Task;
}> = ({  task }) => {
  return (
    <div className={styles.tooltipDefaultContainer}>
      {
        task?.taskItems?.map(item => {
          const { styles: itemStyles, name, start, end, id } = item
          return (
            <div className={styles.tooltipDefaultContainer_item} key={id}>
              <div 
                className={styles.tooltipDefaultContainer_item_color}
                style={{ background: itemStyles?.backgroundColor }}
              ></div>
              <div className={styles.tooltipDefaultContainer_item_name}>{name}：{start ? formatDate(start) : ''}-{end ? formatDate(end) : ''}</div>
              <div>共{getDaysBetweenDates(end, start)}天</div>
            </div>
          )
        })
      }
    </div>
  );
};
