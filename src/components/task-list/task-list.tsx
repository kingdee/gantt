import React, { useEffect, useRef } from "react";
import { BarTask } from "../../types/bar-task";
import { Task } from "../../types/public-types";
import { GanttEvent } from "../../types/gantt-task-actions";
import styles from "./task-list.module.css";

export type TaskListProps = {
  columns: any[];
  headerHeight: number;
  rowWidth: string;
  rowHeight: number;
  rowCount?: number;
  ganttHeight: number;
  scrollY: number;
  scrollTaskListX: number;
  locale: string;
  tasks: Task[];
  taskListRef: React.RefObject<HTMLDivElement>;
  horizontalContainerClass?: string;
  selectedTask: BarTask | undefined;
  setSelectedTask: (task: string) => void;
  onExpanderClick: (task: Task) => void;
  TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    columns: any[];
  }>;
  TaskListTable: React.FC<{
    columns: any[];
    rowHeight: number;
    rowCount?: number;
    rowWidth: string;
    locale: string;
    tasks: Task[];
    selectedTaskId: string;
    ganttEvent: GanttEvent;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
    setGanttEvent: (value: GanttEvent) => void;
  }>;
  ganttEvent: GanttEvent;
  setGanttEvent: (value: GanttEvent) => void;
};

export const TaskList: React.FC<TaskListProps> = ({
  columns,
  headerHeight,
  rowWidth,
  rowHeight,
  rowCount,
  scrollY,
  scrollTaskListX,
  tasks,
  selectedTask,
  setSelectedTask,
  onExpanderClick,
  locale,
  ganttHeight,
  taskListRef,
  horizontalContainerClass,
  TaskListHeader,
  TaskListTable,
  ganttEvent,
  setGanttEvent
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (taskListRef.current) {
      taskListRef.current.scrollLeft = scrollTaskListX;
    }
  }, [scrollTaskListX]);

  const headerProps = {
    columns,
    headerHeight,
    rowWidth,
  };
  const selectedTaskId = selectedTask ? selectedTask.id : "";
  const tableProps = {
    columns,
    rowHeight,
    rowCount,
    rowWidth,
    tasks,
    locale,
    selectedTaskId: selectedTaskId,
    ganttEvent,
    setGanttEvent,
    setSelectedTask,
    onExpanderClick,
  };

  return (
    <div className={styles.taskList} ref={taskListRef}>
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        // 为兼容ie（不支持sticky），内容往下铺开
        style={{ width: 'fit-content', height: ganttHeight ? ganttHeight : `calc(100% - ${headerHeight}px)`, top: headerHeight }}
      >
        {/* <div> */}
          <TaskListTable {...tableProps} />
        {/* </div> */}
        
      </div>
    </div>
  );
};
