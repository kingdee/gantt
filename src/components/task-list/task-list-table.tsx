/*
 * @Author: jianhang_he jianhang_he@kingdee.com
 * @Date: 2024-02-20 16:05:14
 * @LastEditors: jianhang_he jianhang_he@kingdee.com
 * @LastEditTime: 2024-03-13 14:41:35
 * @FilePath: \gantt-task-react\src\components\task-list\task-list-table.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";
import { GanttEvent, GanttContentMoveAction } from "../../types/gantt-task-actions";
import classnames from 'classnames'
import { calcRowTaskHeight } from '../../helpers/bar-helper'
// import { BarTask } from "../../types/bar-task";

// const localeDateStringCache = {};
// const toLocaleDateStringFactory =
//   (locale: string) =>
//   (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
//     const key = date.toString();
//     let lds = localeDateStringCache[key];
//     if (!lds) {
//       lds = date.toLocaleDateString(locale, dateTimeOptions);
//       localeDateStringCache[key] = lds;
//     }
//     return lds;
//   };
// const dateTimeOptions: Intl.DateTimeFormatOptions = {
//   weekday: "short",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// };

const defaultColumnWidth = 160

export const TaskListTableDefault: React.FC<{
  columns: any[];
  rowHeight: number;
  rowCount?: number;
  rowWidth: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  ganttEvent: GanttEvent;
  setGanttEvent: (value: GanttEvent) => void;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
}> = ({
  columns,
  // rowHeight,
  // rowWidth,
  tasks,
  // locale,
  // onExpanderClick,
  ganttEvent,
  setGanttEvent
}) => {
  // const toLocaleDateString = useMemo(
  //   () => toLocaleDateStringFactory(locale),
  //   [locale]
  // );
  

  const _columns = useMemo(() => {
    const newColums = [...columns]

    const maxWidth = 240
    const columnsWidthCount = columns.reduce((preCount, cur) => {
      return preCount + (cur?.width || defaultColumnWidth) 
    }, 0)

    // 补充column，避免hover的时候单元格中间出现断层
    if(maxWidth > columnsWidthCount) {
      newColums.push({ code: 'none', width: maxWidth - columnsWidthCount })
    }

    return newColums
  }, [columns])

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

  return (
    <div
      className={styles.taskListWrapper}
    >
      {tasks.map((t, i) => {
        // let expanderSymbol = "";
        // if (t.hideChildren === false) {
        //   expanderSymbol = "▼";
        // } else if (t.hideChildren === true) {
        //   expanderSymbol = "▶";
        // }

        const taskItemsCount = t.taskItems?.length || 1
        const rowHeight = calcRowTaskHeight(20, taskItemsCount, 12, 12)
        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: calcRowTaskHeight(20, taskItemsCount, 12, 12) }}
            key={`${t.id}row`}
            onMouseEnter={(e: React.MouseEvent) => {
              e.persist()
              onEventStart("row_mouseenter", t, e);
            }}
            onMouseLeave={(e: React.MouseEvent) => {
              e.persist()
              onEventStart("row_mouseleave", t, e);
            }}
          >
            {
              _columns?.map((column) => {
                const { code, width, render, align } = column || {}
                const value = t[code]
                return (
                  <div
                    key={code}
                    className={classnames(styles.taskListCell, {
                      [styles.taskListTableRow_hover]: t.id === ganttEvent.hoverTask?.id
                    })}
                    style={{
                      width: width || defaultColumnWidth,
                      height: rowHeight,
                      maxWidth: width || defaultColumnWidth,
                      minWidth: width || defaultColumnWidth,
                      textAlign: align || 'left',
                    }}
                    title={value}
                  >
                    { typeof render === 'function' ? render(value, t, i) : <div className={styles.taskListCell_content}>{typeof value !== 'string' ? '' : value}</div>}
                    {/* <div className={styles.taskListNameWrapper}>
                      <div
                        className={
                          expanderSymbol
                            ? styles.taskListExpander
                            : styles.taskListEmptyExpander
                        }
                        onClick={() => onExpanderClick(t)}
                      >
                        {expanderSymbol}
                      </div>
                      <div>{t[code]}</div>
                    </div> */}
                  </div>
                )
              })
            }
            {/* <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={t.name}
            >
              <div className={styles.taskListNameWrapper}>
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                <div>{t.name}</div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
            </div> */}
          </div>
        );
      })}
    </div>
  );
};