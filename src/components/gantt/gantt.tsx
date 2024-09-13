import React, {
  useState,
  SyntheticEvent,
  useRef,
  useEffect,
  useMemo
} from "react";
import { ViewMode, GanttProps, Task } from "../../types/public-types";
import { GridProps } from "../grid/grid";
import { ganttDateRange, seedDates, getDateColumnWidthByViewMode, addToDate } from "../../helpers/date-helper";
import { CalendarProps } from "../calendar/calendar";
import { TaskGanttContentProps } from "./task-gantt-content";
import { TaskListHeaderDefault } from "../task-list/task-list-header";
import { TaskListTableDefault } from "../task-list/task-list-table";
import { StandardTooltipContent, Tooltip } from "../other/tooltip";
import { VerticalScroll } from "../other/vertical-scroll";
import { TaskListProps, TaskList } from "../task-list/task-list";
import { TaskGantt } from "./task-gantt";
import { BarTask } from "../../types/bar-task";
import { convertToBarTasks, calcRowTaskY } from "../../helpers/bar-helper";
import { GanttEvent } from "../../types/gantt-task-actions";
import { DateSetup } from "../../types/date-setup";
import { HorizontalScroll } from "../other/horizontal-scroll";
import { removeHiddenTasks, sortTasks } from "../../helpers/other-helper";
import classnames from 'classnames'
// import { SplitPanel } from '@kdcloudjs/kdesign'
import { debounce } from '../../helpers'
import styles from "./gantt.module.css";
// import '@kdcloudjs/kdesign/dist/kdesign.min.css'
import useDebounce from "../../hooks/useDebounce";
import { setLangMap } from "../../helpers/i18-helper";

export const Gantt: React.FunctionComponent<GanttProps> = ({
  tasks,
  columns,
  headerHeight: _headerHeight = 88,
  className,
  // columnWidth = 44,
  listCellWidth = "155px",
  rowHeight = 44,
  rowCount = 1,
  ganttHeight = 0,
  viewMode = ViewMode.Day,
  preStepsCount: preStepsCountProp = 1, // 时间跨度预留数
  locale = "zh-CN",
  localeMap = {},
  barFill = 60,
  barCornerRadius = 4,
  barProgressColor = "#a3a3ff",
  barProgressSelectedColor = "#8282f5",
  barBackgroundColor = "#b8c2cc",
  barBackgroundSelectedColor = "#aeb8c2",
  projectProgressColor = "#7db59a",
  projectProgressSelectedColor = "#59a985",
  projectBackgroundColor = "#fac465",
  projectBackgroundSelectedColor = "#f7bb53",
  milestoneBackgroundColor = "#f1c453",
  milestoneBackgroundSelectedColor = "#f29e4c",
  rtl = false, // right to left
  infiniteScroll = true, // 无限滚动
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = "grey",
  arrowIndent = 20,
  todayColor = "rgba(252, 248, 227, 0.5)",
  viewDate,
  TooltipContent = StandardTooltipContent,
  TaskListHeader = TaskListHeaderDefault,
  TaskListTable = TaskListTableDefault,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
  onSelect,
  onExpanderClick,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const ganttRef = useRef<HTMLDivElement>(null)
  const ganttSvgRef = useRef<HTMLDivElement>(null)
  const taskListRef = useRef<HTMLDivElement>(null)
  const ganttScrollRef = useRef<{ getScrollDom: () => HTMLDivElement, getStatus: () => boolean }>(null)
  
  const [preStepsCount, setPreStepsCount] = useState(preStepsCountProp)
  const [afterStepsCount, setAfterStepsCount] = useState(1)
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(tasks, viewMode, preStepsCount, afterStepsCount);
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
  });
  const [currentViewDate, setCurrentViewDate] = useState<Date | undefined>(
    undefined
  );

  const [taskListWidth, setTaskListWidth] = useState(0);
  const [svgContainerWidth, setSvgContainerWidth] = useState(0);
  const [svgContainerHeight, setSvgContainerHeight] = useState(ganttHeight);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: "",
  });
  const taskHeight = useMemo(
    () => (rowHeight * barFill) / 100,
    [rowHeight, barFill]
  );

  const [selectedTask, setSelectedTask] = useState<BarTask>();
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);
  // const [hoverTask, setHoverTask] = useState<BarTask>();

  let headerHeight = _headerHeight 

  let columnWidth = 44;
  if (viewMode === ViewMode.Year) {
    columnWidth = 365;
    headerHeight = _headerHeight / 2
  } else if (viewMode === ViewMode.Month) {
    columnWidth = 248;
  } else if (viewMode === ViewMode.Week) {
    columnWidth = 168;
  }

  const svgWidth = useMemo(() => {
    return dateSetup.dates.reduce((preCount, cur) => {
      return preCount + getDateColumnWidthByViewMode(viewMode, cur)
    }, 0)
  }, [dateSetup.dates, viewMode]);

  const taskWidth = columns.reduce((count, pre) => {
    return (pre.width || 160) + count
  }, 0)

  const ganttFullHeight = useMemo(() => {
    const _fullHeight = barTasks.reduce((pre, curTask) => {
      if(curTask.taskItems?.length) {
        pre = calcRowTaskY(pre, 20, curTask.taskItems?.length, 12, 12)
      } else {
        pre = calcRowTaskY(pre, 20, 1, 12, 12)
      }

      return pre
    }, 0)
    // console.log('_fullHeight', _fullHeight, barTasks.length * rowHeight)
    return _fullHeight
  }, [barTasks, rowHeight])

  const [scrollY, setScrollY] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [scrollTaskListX, setScrollTaskListX] = useState(0);

  useEffect(() => {
    setLangMap(localeMap)
  }, [locale, localeMap])

  useEffect(() => {
    setPreStepsCount(1)
    setAfterStepsCount(1)
  }, [viewMode])

  // task change events
  useEffect(() => {
    let filteredTasks: Task[];
    if (onExpanderClick) {
      filteredTasks = removeHiddenTasks(tasks);
    } else {
      filteredTasks = tasks;
    }
    filteredTasks = filteredTasks.sort(sortTasks);
    const [startDate, endDate] = ganttDateRange(
      filteredTasks,
      viewMode,
      preStepsCount,
      afterStepsCount
    );
    let newDates = seedDates(startDate, endDate, viewMode);
    if (rtl) {
      newDates = newDates.reverse();
      if (scrollX === -1) {
        setScrollX(svgWidth);
      }
    }
    setDateSetup({ dates: newDates, viewMode });
    setBarTasks(
      convertToBarTasks(
        filteredTasks,
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor,
        viewMode
      )
    );
  }, [
    tasks,
    viewMode,
    preStepsCount,
    afterStepsCount,
    rowHeight,
    barCornerRadius,
    columnWidth,
    taskHeight,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
    rtl,
    scrollX,
    svgWidth,
    onExpanderClick,
  ]);

  useEffect(() => {
    if (
      viewMode === dateSetup.viewMode &&
      ((viewDate && !currentViewDate) ||
        (viewDate && currentViewDate?.valueOf() !== viewDate.valueOf()))
    ) {
      const dates = dateSetup.dates;
      const index = dates.findIndex(
        (d, i) =>
          viewDate.valueOf() >= d.valueOf() &&
          i + 1 !== dates.length &&
          viewDate.valueOf() < dates[i + 1].valueOf()
      );
      if (index === -1) {
        return;
      }
      setCurrentViewDate(viewDate);
      setScrollX(columnWidth * index);
    }
  }, [
    viewDate,
    columnWidth,
    dateSetup.dates,
    dateSetup.viewMode,
    viewMode,
    currentViewDate,
    setCurrentViewDate,
  ]);

  useEffect(() => {
    const { changedTask, action, taskItemConfig } = ganttEvent;
    if (changedTask) {
      if (action === "delete") {
        setGanttEvent({ action: "" });
        setBarTasks(barTasks.filter(t => t.id !== changedTask.id));
      } else if (
        action === "move" ||
        action === "end" ||
        action === "start" ||
        action === "progress"
      ) {
        const prevStateTask = barTasks.find(t => t.id === changedTask.id);

        if(taskItemConfig) {
          const prevStateTaskItemConfig = prevStateTask?.taskItems?.find(t => t.id === taskItemConfig.id)
          if (
            taskItemConfig && prevStateTaskItemConfig.start?.getTime() !== taskItemConfig.start?.getTime() ||
            prevStateTaskItemConfig.end?.getTime() !== taskItemConfig.end.getTime() ||
            prevStateTaskItemConfig.progress !== taskItemConfig.progress
          ) {
            // actions for change
            const newTaskList = barTasks.map(t =>
              t.id === changedTask.id ? changedTask : t
            );
            setBarTasks(newTaskList);
          }
        }
        
      } 
    }
  }, [ganttEvent, barTasks]);

  useEffect(() => {
    if (failedTask) {
      setBarTasks(barTasks.map(t => (t.id !== failedTask.id ? t : failedTask)));
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    if (!listCellWidth) {
      setTaskListWidth(0);
    }
    if (taskListRef.current) {
      setTaskListWidth(taskListRef.current.offsetWidth);
    }
  }, [taskListRef, listCellWidth, columns]);

  useEffect(() => {
    const resized = debounce(function() {  
      // 这里的代码只会在用户停止调整窗口大小后的指定时间间隔后执行一次  
      console.log('Window resized!'); 
      if (wrapperRef.current && taskListRef.current) {
        setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListRef.current.offsetWidth);
        setTaskListWidth(taskListRef.current.offsetWidth);
      } 
    }, 250); // 延迟250毫秒执行  
      
    window.addEventListener('resize', resized);

    return () => {
      window.removeEventListener('resize', resized);
    }
  }, [])

  useEffect(() => {
    if (wrapperRef.current) {
      setSvgContainerWidth(wrapperRef.current.offsetWidth - taskListWidth);
    }
  }, [wrapperRef, taskListWidth, dateSetup.dates]);

  useEffect(() => {
    if (ganttHeight) {
      setSvgContainerHeight(ganttHeight + headerHeight);
    } else {
      setSvgContainerHeight(tasks.length * rowHeight + headerHeight);
    }
  }, [ganttHeight, tasks, headerHeight, rowHeight]);

  useEffect(() => {
    const handleWrapperWheel = (event: WheelEvent) => {
      if (event.shiftKey) return
      // 滑轮滚动(上下滚动)
      let newScrollY = scrollY + event.deltaY;
      const ganttSvgWrapper = ganttSvgRef?.current
      // 处理边界
      if (newScrollY < 0) {
        newScrollY = 0;
      } else if (ganttSvgWrapper && newScrollY + ganttSvgWrapper.clientHeight > ganttFullHeight) {
        newScrollY = ganttFullHeight - ganttSvgWrapper.clientHeight;
      }
      if (newScrollY !== scrollY) {
        setScrollY(newScrollY);
        event.preventDefault();
      }
    }
    wrapperRef.current?.addEventListener("wheel", handleWrapperWheel, { passive: false })
    return () => {
      wrapperRef.current?.removeEventListener("wheel", handleWrapperWheel);
    }
  }, [wrapperRef, ganttFullHeight, scrollY, rtl])

  useEffect(() => {
    const handleListWheel = (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollListX = scrollTaskListX + scrollMove;
        if (newScrollListX < 0) {
          newScrollListX = 0;
        } else if (newScrollListX > taskWidth) {
          newScrollListX = taskWidth;
        }
        setScrollTaskListX(newScrollListX);
        event.preventDefault();
      }
    };
    taskListRef.current?.addEventListener("wheel", handleListWheel, { passive: false })
    return () => {
      taskListRef.current?.removeEventListener("wheel", handleListWheel);
    }
  }, [taskListRef, scrollTaskListX, taskWidth, rtl])

  useEffect(() => {
    const ganttDom = ganttRef.current
    const handleGanttWheel = (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        if (infiniteScroll) {
          if (scrollX === 0) {
            setPreStepsCount(preStepsCount + 1)
          }
          if (judgeEdge()) {
            setAfterStepsCount(afterStepsCount + 2)
          }
        }
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollX = scrollX + scrollMove;
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        setScrollX(newScrollX);
        event.preventDefault();
      }
    };
    ganttDom?.addEventListener("wheel", handleGanttWheel, { passive: false });
    return () => {
      ganttDom?.removeEventListener("wheel", handleGanttWheel);
    }
  }, [ganttRef, scrollX, svgWidth, rtl])

  const handleScrollY = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollY !== event.currentTarget.scrollTop) {
      setScrollY(event.currentTarget.scrollTop);
    }
  };

  const judgeEdge = () => {
    const ganttDom = ganttScrollRef.current?.getScrollDom()
    return ganttDom && ganttDom.scrollLeft + ganttDom.clientWidth >= ganttDom.scrollWidth
  }

  const handleScrollX = (e: SyntheticEvent<HTMLDivElement>) => {

    const target = e.currentTarget || e.nativeEvent?.target
    const scrollLeft = target.scrollLeft
    if (infiniteScroll && judgeEdge()) {
      setAfterStepsCount(afterStepsCount + 1)
    }
    if (infiniteScroll && scrollLeft/svgWidth < 0.2 && scrollLeft < scrollX) {
      setPreStepsCount(preStepsCount + 1)
      const newX = scrollLeft + getDateColumnWidthByViewMode(viewMode, addToDate(dateSetup.dates[0], -1, 'day')) 
      setScrollX(newX > svgWidth ? svgWidth : newX)
    } else if (scrollX !== scrollLeft) { 
      setScrollX(scrollLeft)
    }
  };

  const deScrollGanttX = useDebounce(handleScrollX, 20)

  const handleScrollTaskListX = (event: SyntheticEvent<HTMLDivElement>) => {
    if (scrollTaskListX !== event.currentTarget.scrollLeft) { 
      setScrollTaskListX(event.currentTarget.scrollLeft); 
    }
  };

  /**
   * Handles arrow keys events and transform it to new scroll
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    let newScrollY = scrollY;
    let newScrollX = scrollX;
    let isX = true;
    switch (event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        newScrollY += rowHeight;
        isX = false;
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        newScrollY -= rowHeight;
        isX = false;
        break;
      case "Left":
      case "ArrowLeft":
        newScrollX -= columnWidth;
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        newScrollX += columnWidth;
        break;
    }
    if (isX) {
      if (newScrollX < 0) {
        newScrollX = 0;
      } else if (newScrollX > svgWidth) {
        newScrollX = svgWidth;
      }
      setScrollX(newScrollX);
    } else {
      if (newScrollY < 0) {
        newScrollY = 0;
      } else if (newScrollY > ganttFullHeight - ganttHeight) {
        newScrollY = ganttFullHeight - ganttHeight;
      }
      setScrollY(newScrollY);
    }
  };

  /**
   * Task select event
   */
  const handleSelectedTask = (taskId: string) => {
    const newSelectedTask = barTasks.find(t => t.id === taskId);
    const oldSelectedTask = barTasks.find(
      t => !!selectedTask && t.id === selectedTask.id
    );
    if (onSelect) {
      if (oldSelectedTask) {
        onSelect(oldSelectedTask, false);
      }
      if (newSelectedTask) {
        onSelect(newSelectedTask, true);
      }
    }
    setSelectedTask(newSelectedTask);
  };
  const handleExpanderClick = (task: Task) => {
    if (onExpanderClick && task.hideChildren !== undefined) {
      onExpanderClick({ ...task, hideChildren: !task.hideChildren });
    }
  };
  const gridProps: GridProps = {
    viewMode,
    ganttEvent,
    columnWidth,
    svgWidth,
    tasks: tasks,
    rowHeight,
    rowCount,
    dates: dateSetup.dates,
    todayColor,
    rtl,
    setGanttEvent
  };
  const calendarProps: CalendarProps = {
    dateSetup,
    locale,
    viewMode,
    headerHeight,
    columnWidth,
    svgWidth,
    rtl,
  };
  const barProps: TaskGanttContentProps = {
    tasks: barTasks,
    dates: dateSetup.dates,
    ganttEvent,
    selectedTask,
    rowHeight,
    rowCount,
    taskHeight,
    columnWidth,
    arrowColor,
    timeStep,
    arrowIndent,
    svgWidth,
    rtl,
    setGanttEvent,
    setFailedTask,
    setSelectedTask: handleSelectedTask,
    onDateChange,
    onProgressChange,
    onDoubleClick,
    onClick,
    onDelete,
  };

  const tableProps: TaskListProps = {
    rowHeight,
    rowCount,
    rowWidth: listCellWidth,
    tasks: barTasks,
    locale,
    headerHeight,
    scrollY,
    scrollTaskListX,
    ganttHeight,
    horizontalContainerClass: styles.task_horizontalContainer,
    selectedTask,
    taskListRef,
    setSelectedTask: handleSelectedTask,
    onExpanderClick: handleExpanderClick,
    TaskListHeader,
    TaskListTable,
    columns,
    ganttEvent,
    setGanttEvent,
  };

  return (
    <div
      className={classnames(styles.gantt, className)}
    >
      <div
        className={styles.wrapper}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        {/* <SplitPanel
        min={240}
        max={0.6}
          firstSlot={listCellWidth && <TaskList {...tableProps} />} 
          secondSlot={<TaskGantt
            gridProps={gridProps}
            calendarProps={calendarProps}
            barProps={barProps}
            ganttHeight={ganttHeight}
            scrollY={scrollY}
            scrollX={scrollX}
            ganttFullHeight={ganttFullHeight}
          />} 
        /> */}
        {listCellWidth && <TaskList {...tableProps} />} 
        <TaskGantt
          ref={ganttRef}
          svgWrapperRef={ganttSvgRef}
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttHeight}
          scrollY={scrollY}
          scrollX={scrollX}
          ganttFullHeight={ganttFullHeight}
        />
        {ganttEvent.hoverTask && ganttEvent.action === 'row_mouseenter' && ganttEvent.event && (
          <Tooltip
            arrowIndent={arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={svgContainerHeight}
            svgContainerWidth={svgContainerWidth}
            scrollX={scrollX}
            scrollY={scrollY}
            task={ganttEvent.hoverTask}
            headerHeight={headerHeight}
            taskListWidth={taskListWidth}
            TooltipContent={TooltipContent}
            rtl={rtl}
            svgWidth={svgWidth}
            mouseEvent={ganttEvent.event}
          />
        )}
        <VerticalScroll
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={scrollY}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
      // @ts-ignore
        ref={ganttScrollRef}
        scrollWidth={svgWidth}
        offsetWidth={taskListWidth}
        scroll={scrollX}
        rtl={rtl}
        onScroll={deScrollGanttX}
      />
      <HorizontalScroll
        scrollWidth={taskWidth}
        offsetWidth={svgContainerWidth}
        scroll={scrollTaskListX}
        rtl={rtl}
        style={{ margin: `-12px ${svgContainerWidth}px 0px 0px` }}
        onScroll={handleScrollTaskListX}
      />
    </div>
  );
};

Gantt.displayName = 'Gantt'