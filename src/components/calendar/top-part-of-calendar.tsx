import React from "react";
import styles from "./calendar.module.css";
import classnames from 'classnames'

type TopPartOfCalendarProps = {
  value: string;
  x1Line?: number;
  y1Line?: number;
  y2Line?: number;
  xText?: number;
  yText?: number;
  hideLine?: boolean;
  width?: number;
  className?: string;
};

export const TopPartOfCalendar: React.FC<TopPartOfCalendarProps> = ({
  value,
  // x1Line,
  // y1Line,
  // y2Line,
  // xText,
  // yText,
  // hideLine,
  width,
  className
}) => {
  return (
    <div className={classnames(styles.calendarTop, className)} style={{ width }}>
      {/* {
        !hideLine && (
          <line
            x1={x1Line}
            y1={y1Line}
            x2={x1Line}
            y2={y2Line}
            className={styles.calendarTopTick}
            key={value + "line"}
          />
        )
      } */}
      <div
        key={value + "text"}
        className={styles.calendarTopText}
        title={value}
      >
        {value}
      </div>
    </div>
  );
};
