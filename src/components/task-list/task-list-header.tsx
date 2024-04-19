import React, { useMemo } from "react";
import styles from "./task-list-header.module.css";

// const alignMap = {
//   'left': 'flex-start',
//   'center': 'center',
//   'right': 'flex-end'
// }

const defaultColumnWidth = 160

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  // rowWidth: string;
  columns: any[]
}> = ({ headerHeight, columns }) => {

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

  return (
    <div
      className={styles.ganttTable}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight,
        }}
      >
        {
          _columns?.map((column) => {
            const {
              code,
              name,
              width,
              align = 'left',
              // lock
            } = column || {}

            const style: any = {
              width: width || 160,
              textAlign: align || 'left',
              maxWidth: width || 160,
              minWidth: width || 160,
            }

            // if (lock) {
            //   style.position = 'sticky'
            //   style.left = 0
            //   style.zIndex = 1
            // }

            return (
              <div
                key={code}
                className={styles.ganttTable_HeaderItem}
                style={style}
              >
                <div className={styles.ganttTable_HeaderItem_name}>{name}</div>
              </div>
            )
          })
        }
        {/* <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;Name
        </div> */}
        {/* <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
          }}
        /> */}
        {/* <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;From
        </div> */}
        {/* <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        /> */}
        {/* <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;To
        </div> */}
      </div>
    </div>
  );
};
