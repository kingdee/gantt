import { Task, ViewMode } from "../types/public-types";
import { BarTask, TaskTypeInternal } from "../types/bar-task";
import { BarMoveAction } from "../types/gantt-task-actions";
import { getDateColumnWidthByViewMode } from "./date-helper";

export const calcRowTaskHeight = (taskHeight: number, taskItemsLen: number, topMargin: number, taskSpacing: number) => {
  return taskItemsLen * taskHeight + taskItemsLen * taskSpacing + topMargin
}

export const calcRowTaskY = (preY: number, taskHeight: number, taskItemsLen: number, topMargin: number, taskSpacing: number) => {
  return preY + calcRowTaskHeight(taskHeight, taskItemsLen, topMargin, taskSpacing)
}

export const convertToBarTasks = (
  tasks: Task[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  viewMode: ViewMode
) => {
  let rowY = 0
  let barTasks = tasks.map((t, i) => {
    const _task = convertToBarTask(
      t,
      i,
      dates,
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
      rowY,
      viewMode
    );

    const taskItemsLen = t.taskItems?.length || 1
    rowY = calcRowTaskY(rowY, 20, taskItemsLen, 12, 12);
    
    return _task
  });

  // set dependencies
  barTasks = barTasks.map(task => {
    const dependencies = task.dependencies || [];
    for (let j = 0; j < dependencies.length; j++) {
      const dependence = barTasks.findIndex(
        value => value.id === dependencies[j]
      );
      if (dependence !== -1) barTasks[dependence].barChildren.push(task);
    }
    return task;
  });

  return barTasks;
};

const convertToBarTask = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  rowY: number,
  viewMode: ViewMode
): BarTask => {
  let barTask: BarTask;
  switch (task.type) {
    case "milestone":
      barTask = convertToMilestone(
        task,
        index,
        dates,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor,
        viewMode
      );
      break;
    case "project":
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        // rowHeight,
        // taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        0,
        viewMode
      );
      break;
    default:
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        // rowHeight,
        // taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        rowY,
        viewMode
      );
      break;
  }
  return barTask;
};

const convertToBar = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  // rowHeight: number,
  // taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  rowY: number,
  viewMode: ViewMode
): BarTask => {
  const topMargin = 12
  const taskSpacing = 12
  // console.log('convertToBar', task, rtl)
  let x1: number;
  let x2: number;
  // 用于添加x1、x2
  let newTaskItems: any[] = []

  const { taskItems = [] } = task
  
  if (rtl) {
    x2 = taskXCoordinateRTL(task.start, dates, columnWidth, viewMode);
    x1 = taskXCoordinateRTL(task.end, dates, columnWidth, viewMode);
  } else {
    if(taskItems.length > 0) {
      let _y = rowY
      taskItems.forEach((taskItemConfig, itemIndex) => {
        let typeInternal: TaskTypeInternal = task.type;

        x1 =  taskItemConfig.start ? taskXCoordinate(taskItemConfig.start, dates, viewMode) : 0,
        x2 = taskItemConfig.end ? taskXCoordinate(taskItemConfig.end, dates, viewMode) : 0

        const [progressWidth, progressX] = progressWithByParams(
          x1,
          x2,
          taskItemConfig.progress,
          rtl
        );

        if (typeInternal === "task" && x2 - x1 < handleWidth * 2) {
          typeInternal = "smalltask";
          x2 = x1 + handleWidth * 2;
        }

        if(!x1 || !x2) {
          typeInternal = "milestone";
          // 这里是因为天都是从0点开始，因此x1或者x2是定位在最左侧。因此要想定位在列中间，11是估计的一个值
          x1 = (x1 || x2) + 11
        }

        if(itemIndex === 0) {
          _y = rowY + topMargin;
        } else {
          _y = _y + 20 + taskSpacing
        }

        newTaskItems.push({
          ...taskItemConfig,
          x1: x1 || x2,
          x2,
          y: _y,
          progressWidth,
          progressX,
          typeInternal
        })
      });
    }
    // x1 = taskXCoordinate(task.start, dates, columnWidth);
    // x2 = taskXCoordinate(task.end, dates, columnWidth);
  }
  
  // const y = taskYCoordinate(index, rowHeight, taskHeight);
  const hideChildren = task.type === "project" ? task.hideChildren : undefined;

  const _rowHeight = calcRowTaskHeight(20, taskItems?.length || 1, topMargin, taskSpacing)
  // console.log('_rowHeight', _rowHeight)
  const styles = {
    backgroundColor: barBackgroundColor,
    backgroundSelectedColor: barBackgroundSelectedColor,
    progressColor: barProgressColor,
    progressSelectedColor: barProgressSelectedColor,
    ...task.styles,
  };
  return {
    ...task,
    typeInternal: 'task',
    x1: 0,
    x2: 0,
    y: rowY,
    index,
    progressX: 0,
    progressWidth: 0,
    barCornerRadius,
    handleWidth,
    hideChildren,
    height: _rowHeight,
    barChildren: [],
    styles,
    taskItems: newTaskItems
  };
};

const convertToMilestone = (
  task: Task,
  index: number,
  dates: Date[],
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string,
  viewMode: ViewMode
): BarTask => {
  const x = taskXCoordinate(task.start, dates, viewMode);
  const y = taskYCoordinate(index, rowHeight, taskHeight);

  const x1 = x - taskHeight * 0.5;
  const x2 = x + taskHeight * 0.5;

  const rotatedHeight = taskHeight / 1.414;
  const styles = {
    backgroundColor: milestoneBackgroundColor,
    backgroundSelectedColor: milestoneBackgroundSelectedColor,
    progressColor: "",
    progressSelectedColor: "",
    ...task.styles,
  };
  return {
    ...task,
    end: task.start,
    x1,
    x2,
    y,
    index,
    progressX: 0,
    progressWidth: 0,
    barCornerRadius,
    handleWidth,
    typeInternal: task.type,
    progress: 0,
    height: rotatedHeight,
    hideChildren: undefined,
    barChildren: [],
    styles,
  };
};

// 计算X的位置
const taskXCoordinate = (xDate: Date, dates: Date[], viewMode: ViewMode) => {
  const curDateTime = xDate.getTime()
  // 当前日期的前一天坐标
  const index = dates.findIndex(d => d.getTime() >= curDateTime) - 1;
  if(index < 0) return 0
  
  // 偏移量
  const remainderMillis = curDateTime - dates[index]?.getTime();

  const preDateX = dates.reduce((count, cur, reduceIndex) => {
    if(index > reduceIndex) {
      return count + getDateColumnWidthByViewMode(viewMode, cur)
    }
    return count
  }, 0)

  // 占比，偏移量/hou
  const percentOfInterval =
    remainderMillis / (dates[index + 1]?.getTime() - dates[index]?.getTime());
  const x = preDateX + percentOfInterval * getDateColumnWidthByViewMode(viewMode, dates[index]);
  return x;
};
const taskXCoordinateRTL = (
  xDate: Date,
  dates: Date[],
  columnWidth: number,
  viewMode: ViewMode
) => {
  let x = taskXCoordinate(xDate, dates, viewMode);
  x += columnWidth;
  return x;
};
const taskYCoordinate = (
  index: number,
  rowHeight: number,
  taskHeight: number
) => {
  const y = index * rowHeight + (rowHeight - taskHeight) / 2;
  return y;
};

export const progressWithByParams = (
  taskX1: number,
  taskX2: number,
  progress: number,
  rtl: boolean
) => {
  const progressWidth = (taskX2 - taskX1) * progress * 0.01;
  let progressX: number;
  if (rtl) {
    progressX = taskX2 - progressWidth;
  } else {
    progressX = taskX1;
  }
  return [progressWidth, progressX];
};

export const progressByProgressWidth = (
  progressWidth: number,
  barTask: BarTask
) => {
  const barWidth = barTask.x2 - barTask.x1;
  const progressPercent = Math.round((progressWidth * 100) / barWidth);
  if (progressPercent >= 100) return 100;
  else if (progressPercent <= 0) return 0;
  else return progressPercent;
};

const progressByX = (x: number, task: BarTask) => {
  if (x >= task.x2) return 100;
  else if (x <= task.x1) return 0;
  else {
    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((x - task.x1) * 100) / barWidth);
    return progressPercent;
  }
};
const progressByXRTL = (x: number, task: BarTask) => {
  if (x >= task.x2) return 0;
  else if (x <= task.x1) return 100;
  else {
    const barWidth = task.x2 - task.x1;
    const progressPercent = Math.round(((task.x2 - x) * 100) / barWidth);
    return progressPercent;
  }
};

export const getProgressPoint = (
  progressX: number,
  taskY: number,
  taskHeight: number
) => {
  const point = [
    progressX - 5,
    taskY + taskHeight,
    progressX + 5,
    taskY + taskHeight,
    progressX,
    taskY + taskHeight - 8.66,
  ];
  return point.join(",");
};

const startByX = (x: number, xStep: number, task: BarTask) => {
  if (x >= task.x2 - task.handleWidth * 2) {
    x = task.x2 - task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x1 + additionalXValue;
  return newX;
};

const endByX = (x: number, xStep: number, task: BarTask) => {
  if (x <= task.x1 + task.handleWidth * 2) {
    x = task.x1 + task.handleWidth * 2;
  }
  const steps = Math.round((x - task.x2) / xStep);
  const additionalXValue = steps * xStep;
  const newX = task.x2 + additionalXValue;
  return newX;
};

const moveByX = (x: number, xStep: number, task: BarTask) => {
  const steps = Math.round((x - task.x1) / xStep);
  const additionalXValue = steps * xStep;
  const newX1 = task.x1 + additionalXValue;
  const newX2 = newX1 + task.x2 - task.x1;
  return [newX1, newX2];
};

const dateByX = (
  x: number,
  taskX: number,
  taskDate: Date,
  xStep: number,
  timeStep: number
) => {
  let newDate = new Date(((x - taskX) / xStep) * timeStep + taskDate.getTime());
  newDate = new Date(
    newDate.getTime() +
      (newDate.getTimezoneOffset() - taskDate.getTimezoneOffset()) * 60000
  );
  return newDate;
};

/**
 * Method handles event in real time(mousemove) and on finish(mouseup)
 */
export const handleTaskBySVGMouseEvent = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean,
  taskItemConfig?: any
): { isChanged: boolean; changedTask: BarTask } => {
  let result: { isChanged: boolean; changedTask: BarTask };
  switch (selectedTask.type) {
    case "milestone":
      result = handleTaskBySVGMouseEventForMilestone(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta
      );
      break;
    default:
      result = handleTaskBySVGMouseEventForBar(
        svgX,
        action,
        selectedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl,
        taskItemConfig
      );
      break;
  }
  return result;
};

const handleTaskBySVGMouseEventForBar = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number,
  rtl: boolean,
  taskItemConfig: any
): { isChanged: boolean; changedTask: BarTask } => {
  const changedTask: any = { ...selectedTask };
  const changedTakItemConfig = { ...taskItemConfig }
  let isChanged = false;
  switch (action) {
    case "progress":
      if (rtl) {
        changedTask.progress = progressByXRTL(svgX, selectedTask);
      } else {
        changedTask.progress = progressByX(svgX, selectedTask);
      }
      isChanged = changedTask.progress !== selectedTask.progress;
      if (isChanged) {
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    case "start": {
      const newX1 = startByX(svgX, xStep, taskItemConfig);
      changedTakItemConfig.x1 = newX1;
      isChanged = changedTakItemConfig.x1 !== taskItemConfig.x1;
      if (isChanged) {
        if (rtl) {
          changedTakItemConfig.end = dateByX(
            newX1,
            taskItemConfig.x1,
            taskItemConfig.end,
            xStep,
            timeStep
          );
        } else {
          changedTakItemConfig.start = dateByX(
            newX1,
            taskItemConfig.x1,
            taskItemConfig.start,
            xStep,
            timeStep
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          taskItemConfig.x1,
          taskItemConfig.x2,
          taskItemConfig.progress,
          rtl
        );
        changedTakItemConfig.progressWidth = progressWidth;
        changedTakItemConfig.progressX = progressX;

        changedTask.taskItems = selectedTask.taskItems?.map(item => {
          if(item.id === changedTakItemConfig.id) {
            return changedTakItemConfig
          }

          return item
        })
      }
      break;
    }
    case "end": {
      const newX2 = endByX(svgX, xStep, taskItemConfig);
      changedTakItemConfig.x2 = newX2;
      isChanged = changedTakItemConfig.x2 !== selectedTask.x2;
      if (isChanged) {
        if (rtl) {
          changedTakItemConfig.start = dateByX(
            newX2,
            taskItemConfig.x2,
            taskItemConfig.start,
            xStep,
            timeStep
          );
        } else {
          changedTakItemConfig.end = dateByX(
            newX2,
            taskItemConfig.x2,
            taskItemConfig.end,
            xStep,
            timeStep
          );
        }
        const [progressWidth, progressX] = progressWithByParams(
          taskItemConfig.x1,
          taskItemConfig.x2,
          taskItemConfig.progress,
          rtl
        );
        changedTakItemConfig.progressWidth = progressWidth;
        changedTakItemConfig.progressX = progressX;

        changedTask.taskItems = selectedTask.taskItems?.map(item => {
          if(item.id === changedTakItemConfig.id) {
            return changedTakItemConfig
          }

          return item
        })

        // console.log('changedTaskend', selectedTask, changedTask)
      }
      break;
    }
    case "move": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep
        );
        changedTask.end = dateByX(
          newMoveX2,
          selectedTask.x2,
          selectedTask.end,
          xStep,
          timeStep
        );
        changedTask.x1 = newMoveX1;
        changedTask.x2 = newMoveX2;
        const [progressWidth, progressX] = progressWithByParams(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progressWidth;
        changedTask.progressX = progressX;
      }
      break;
    }
  }
  return { isChanged, changedTask };
};

const handleTaskBySVGMouseEventForMilestone = (
  svgX: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  xStep: number,
  timeStep: number,
  initEventX1Delta: number
): { isChanged: boolean; changedTask: BarTask } => {
  const changedTask: BarTask = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "move": {
      const [newMoveX1, newMoveX2] = moveByX(
        svgX - initEventX1Delta,
        xStep,
        selectedTask
      );
      isChanged = newMoveX1 !== selectedTask.x1;
      if (isChanged) {
        changedTask.start = dateByX(
          newMoveX1,
          selectedTask.x1,
          selectedTask.start,
          xStep,
          timeStep
        );
        changedTask.end = changedTask.start;
        changedTask.x1 = newMoveX1;
        changedTask.x2 = newMoveX2;
      }
      break;
    }
  }
  return { isChanged, changedTask };
};
