/*
 * @Author: jianhang_he jianhang_he@kingdee.com
 * @Date: 2024-02-20 16:05:14
 * @LastEditors: jianhang_he jianhang_he@kingdee.com
 * @LastEditTime: 2024-03-26 14:28:23
 * @FilePath: \gantt-task-react\src\components\gantt\task-gantt.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { 
  useRef, useEffect,
  forwardRef, 
  // useMemo 
} from "react";
import { GridProps, Grid, GridToday } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import styles from "./gantt.module.css";

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
  ganttFullHeight: number;
  svgWrapperRef: React.RefObject<HTMLDivElement>
};
export const TaskGantt = forwardRef<HTMLDivElement, TaskGanttProps>(({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
  ganttFullHeight,
  svgWrapperRef
}, ref: React.ForwardedRef<HTMLDivElement>) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = svgWrapperRef || useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = ref || useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    // @ts-ignore
    if (verticalGanttContainerRef?.current) {
    // @ts-ignore
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  // const horizontalContainerHeight = useMemo(() => {
  //   return  horizontalContainerRef.current?.getBoundingClientRect()?.height || 0
  // }, [horizontalContainerRef.current])

  const horizontalContainerHeight = horizontalContainerRef.current?.getBoundingClientRect()?.height || 0

  // console.log('horizontalContainerRef', horizontalContainerHeight)

  const _ganttFullHeight = horizontalContainerHeight > ganttFullHeight ? horizontalContainerHeight : ganttFullHeight

  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
      dir="ltr"
    >
      <div
        style={{ flexShrink: 0, width: gridProps.svgWidth, height: calendarProps.headerHeight  }}
      >
        <Calendar {...calendarProps} />
      </div>
      <div
        ref={horizontalContainerRef}
        className={styles.gantt_horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={gridProps.svgWidth}
          height={_ganttFullHeight}
          ref={ganttSVGRef}
          style={{
            width: gridProps.svgWidth,
            height: _ganttFullHeight
          }}
        >
          <Grid {...gridProps} ganttFullHeight={_ganttFullHeight}/>
          <TaskGanttContent {...newBarProps} />
          <GridToday {...gridProps}  ganttFullHeight={_ganttFullHeight}/>
        </svg>
      </div>
    </div>
  );
});
