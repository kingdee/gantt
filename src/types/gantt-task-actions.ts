import { BarTask } from "./bar-task";

export type TaskAction = 'row_mouseenter' | 'row_mouseleave'
export type BarMoveAction = "progress" | "end" | "start" | "move";
export type GanttContentMoveAction =
  | "mouseenter"
  | "mouseleave"
  | "delete"
  | "dblclick"
  | "click"
  | "select"
  | ""
  | BarMoveAction
  | TaskAction;

export type GanttEvent = {
  hoverTask?: BarTask;
  changedTask?: BarTask;
  originalSelectedTask?: BarTask;
  action: GanttContentMoveAction;
  taskItemConfig?: any;
  event?: React.MouseEvent;
};
