import { Task, ViewMode } from "../types/public-types";
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import DateTimeFormat = Intl.DateTimeFormat;

type DateHelperScales =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

const intlDTCache = {};
export const getCachedDateTimeFormat = (
  locString: string | string[],
  opts: DateTimeFormatOptions = {}
): DateTimeFormat => {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache[key];
  
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }
  // console.log('dtf',intlDTCache,  dtf)
  return dtf;
};

export const addToDate = (
  date: Date,
  quantity: number,
  scale: DateHelperScales
) => {
  const newDate = new Date(
    date.getFullYear() + (scale === "year" ? quantity : 0),
    date.getMonth() + (scale === "month" ? quantity : 0),
    date.getDate() + (scale === "day" ? quantity : 0),
    date.getHours() + (scale === "hour" ? quantity : 0),
    date.getMinutes() + (scale === "minute" ? quantity : 0),
    date.getSeconds() + (scale === "second" ? quantity : 0),
    date.getMilliseconds() + (scale === "millisecond" ? quantity : 0)
  );
  return newDate;
};

export const startOfDate = (date: Date, scale: DateHelperScales) => {
  const scores = [
    "millisecond",
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year",
  ];

  const shouldReset = (_scale: DateHelperScales) => {
    const maxScore = scores.indexOf(scale);
    return scores.indexOf(_scale) <= maxScore;
  };
  const newDate = new Date(
    date.getFullYear(),
    shouldReset("year") ? 0 : date.getMonth(),
    shouldReset("month") ? 1 : date.getDate(),
    shouldReset("day") ? 0 : date.getHours(),
    shouldReset("hour") ? 0 : date.getMinutes(),
    shouldReset("minute") ? 0 : date.getSeconds(),
    shouldReset("second") ? 0 : date.getMilliseconds()
  );
  return newDate;
};

// 获取甘特图时间范围
export const ganttDateRange = (
  tasks: Task[],
  viewMode: ViewMode,
  preStepsCount: number
) => {
  let firstExistTime

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    const taskItems = task.taskItems || []

    const exsitTimeTaskItem = taskItems.find(taskItem => (taskItem.start || taskItem.end))

    if(exsitTimeTaskItem && (exsitTimeTaskItem.start || exsitTimeTaskItem.end)) {
      firstExistTime = exsitTimeTaskItem.start || exsitTimeTaskItem.end
      break
    }
  }

  let newStartDate: Date | undefined  = firstExistTime || new Date()
  let newEndDate: Date | undefined = firstExistTime || new Date()

  // for(let i = 0; i < tasks.length; i++) {
  //   const { taskItems = [] } = tasks[i] || {}
  //   for(let j = 0; j < taskItems.length; j++) {
  //     const { start, end } = taskItems[j]
  //     if(newStartDate !== new Date(0) && start) {
  //       newStartDate = start
  //     }
  //     if(newEndDate !== new Date(0) && end) {
  //       newEndDate = end
  //     }
  //     if(newStartDate !== new Date(0) && newEndDate !== new Date(0)) {
  //       break
  //     }
  //   }
  // }

  // 获取最小和最大的时间
  for (const task of tasks) {
    const { taskItems = []} = task
    for(const taskItemConfig of taskItems) {
      let _startTime = taskItemConfig.start
      let _endTime = taskItemConfig.end

      // 开始时间和结束时候有可能不存在，那么需要拿存在的做比较
      if(_startTime && !_endTime) {
        _endTime = _startTime
      } else if(!_startTime && _endTime) {
        _startTime = _endTime
      }

      if (_startTime < newStartDate) {
        newStartDate = _startTime;
      }
      if (_endTime > newEndDate) {
        newEndDate = _endTime;
      }
    }
  }

  // console.log('newEndDate start', newStartDate, newEndDate)
  
  switch (viewMode) {
    case ViewMode.Year:
      newStartDate = addToDate(newStartDate, -1, "year");
      newStartDate = startOfDate(newStartDate, "year");
      newEndDate = addToDate(newEndDate, 1, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.QuarterYear:
      newStartDate = addToDate(newStartDate, -3, "month");
      newStartDate = startOfDate(newStartDate, "month");
      newEndDate = addToDate(newEndDate, 3, "month");
      newEndDate = startOfDate(newEndDate, "month");
      break;
    case ViewMode.Month:
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "month");
      newStartDate = startOfDate(newStartDate, "month");
      newEndDate = addToDate(newEndDate, 1, "year");
      newEndDate = startOfDate(newEndDate, "year");
      break;
    case ViewMode.Week:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(
        getMonday(newStartDate),
        -7 * preStepsCount,
        "day"
      );
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 1.5, "month");
      break;
    case ViewMode.Day:
      // 前后渲染满一个月
      // console.log('newEndDate1', newStartDate, newEndDate)
      const startDataDay = newStartDate.getDate()
      // const startDaysInMonth = getDaysInMonth(newStartDate.getMonth(), newStartDate.getFullYear())
      // 用当前月份多少天，减去结束日期当天。用于渲染当月后续不足的天数
      // const startApartDay = startDaysInMonth - startDataDay
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(newStartDate, -1 * (startDataDay === 1 ? startDataDay : startDataDay - 1), "day");

      const endDaysInMonth = getDaysInMonth(newEndDate.getMonth(), newEndDate.getFullYear())
      const newEndDay = newEndDate.getDate()
      // 用当前月份多少天，减去结束日期当天。用于渲染当月后续不足的天数
      const endApartDay = endDaysInMonth - newEndDay

      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, endApartDay === 0 ? endApartDay + 1 : endApartDay, "day");

      // console.log('newEndDate2', newStartDate, newEndDate)
      break;
    case ViewMode.QuarterDay:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 66, "hour"); // 24(1 day)*3 - 6
      break;
    case ViewMode.HalfDay:
      newStartDate = startOfDate(newStartDate, "day");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "day");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 108, "hour"); // 24(1 day)*5 - 12
      break;
    case ViewMode.Hour:
      newStartDate = startOfDate(newStartDate, "hour");
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, "hour");
      newEndDate = startOfDate(newEndDate, "day");
      newEndDate = addToDate(newEndDate, 1, "day");
      break;
  }
  return [newStartDate, newEndDate];
};

export const seedDates = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
) => {
  let currentDate: Date = new Date(startDate);
  const dates: Date[] = [currentDate];
  while (currentDate < endDate) {
    switch (viewMode) {
      case ViewMode.Year:
        currentDate = addToDate(currentDate, 1, "year");
        break;
      case ViewMode.QuarterYear:
        currentDate = addToDate(currentDate, 3, "month");
        break;
      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, "month");
        break;
      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, "day");
        break;
      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, "day");
        break;
      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, "hour");
        break;
      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, "hour");
        break;
      case ViewMode.Hour:
        currentDate = addToDate(currentDate, 1, "hour");
        break;
    }
    dates.push(currentDate);
  }
  return dates;
};

export const getLocaleYear = (date: Date, locale: string) => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    year: "numeric",
  }).format(date);
  return bottomValue;
};

export const getLocaleMonth = (date: Date, locale: string) => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    month: "2-digit",
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

export const getLocalDayOfWeek = (
  date: Date,
  locale: string,
  format?: "long" | "short" | "narrow" | undefined
) => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    weekday: format,
  }).format(date);
  // console.log('getLocalDayOfWeek', bottomValue)
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

/**
 * Returns monday of current week
 * @param date date for modify
 */
const getMonday = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

export const getWeekNumberISO8601 = (date: Date) => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  if (weekNumber.length === 1) {
    return `0${weekNumber}`;
  } else {
    return weekNumber;
  }
};

export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getPaddedNumber = (num: number): string => {
  return (num < 10 ? '0' : '') + num;
}

export const getColumnWidthByViewMode = (viewMode: ViewMode) => {
  let columnWidth = 44;
  if (viewMode === ViewMode.Year) {
    columnWidth = 365;
  } else if (viewMode === ViewMode.Month) {
    columnWidth = 248;
  } else if (viewMode === ViewMode.Week) {
    columnWidth = 168;
  }

  return columnWidth
}

export const oneDayTime = 86400000;  // 1000 * 60 * 60 * 24  一天有多少毫秒

export const getTodayXByTimeMode = (viewMode: ViewMode) => {
  const now = new Date()

  const columnWidth = getDateColumnWidthByViewMode(viewMode, now)

  let percentage = 0.5
  
  const curMonth = now.getMonth()
  const curYear = now.getFullYear()
  const curDate = now.getDate()
  const startOfYear = new Date(curYear, 0, 0);
  const diff = +now - +startOfYear;

  if (viewMode === ViewMode.Year) {
    const days = getDaysInYear(curYear)

    percentage = diff / (days * oneDayTime)
  } else if (viewMode === ViewMode.QuarterYear) {
    const days = getDaysInCurrentQuarter(now)

    // 获取当前季度的第一天  
    const firstDayOfQuarter = new Date(curYear, curMonth - (curMonth % 3), 1);  
  
    // 计算今天是当前季度的第几天  
    const diff = +now - +firstDayOfQuarter;

    percentage = diff / (days * oneDayTime)
  } else if (viewMode === ViewMode.Month) {
    const days = getDaysInMonth(curMonth, curYear)

    percentage = curDate / days
  } else if (viewMode === ViewMode.Week) {
    const weekDay = now.getDay()
    percentage = weekDay / 7
  }

  const x = percentage * columnWidth

  return x
}

export const formatDate = (date: Date) => {
  const month = getPaddedNumber(date.getMonth() + 1)
  const day = getPaddedNumber(date.getDate())
  return `${date.getFullYear()}${month}${day}`
}

export const getDaysBetweenDates = (date1: Date, date2: Date) => {
  if(!date1 || !date2) {
    return 0
  }

  // 计算两个日期之间的毫秒差  
  var diff = Math.abs(+date2 - (+date1));  

  // 将毫秒差转换为天数  
  var days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // 1000毫秒/秒 * 60秒/分钟 * 60分钟/小时 * 24小时/天  

  return days;  
}

// 是否闰年
export const isLeapYear = (year: number): boolean => {  
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;  
}  

// 获取一年有多少天
export const getDaysInYear = (year: number): number => {  
  return isLeapYear(year) ? 366 : 365;  
}

const dayColumnWidthInViewMode = {
  [ViewMode.Day]: 44,
  [ViewMode.Week]: 24,
  [ViewMode.Month]: 8,
  [ViewMode.QuarterYear]: 3,
  [ViewMode.Year]: 1
}

// 获取月的行宽度
export const getMonthColumnWidth = (viewMode: ViewMode, date: Date): number => {
  const dayColumnWidth = dayColumnWidthInViewMode[viewMode] || dayColumnWidthInViewMode[ViewMode.Day]

  const daysInMonth = getDaysInMonth(date.getMonth(), date.getFullYear())

  return daysInMonth * dayColumnWidth
}

// 获取年的行宽度
export const getYearColumnWidth = (viewMode: ViewMode, date: Date): number => {
  const dayColumnWidth = dayColumnWidthInViewMode[viewMode] || dayColumnWidthInViewMode[ViewMode.Day]

  const daysInYear = getDaysInYear(date.getFullYear())

  return daysInYear * dayColumnWidth
}

// 获取当前时间是第几季度
export const getQuarter = (date: Date) => {  
  // 获取月份（注意：JavaScript 月份是从 0 开始的，所以 1 代表二月）  
  var month = date.getMonth();  
    
  // 根据月份计算季度  
  var quarter = Math.ceil((month + 1) / 3);  
    
  return quarter;  
}

// 获取一个季度有多少天
export const getDaysInCurrentQuarter = (date: Date) => {
  const year = date.getFullYear();
  const quarter = getQuarter(date);  
    
  // 定义每个月的天数，注意2月需要根据闰年判断  
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];  
    
  // 计算当前季度的起始月份和结束月份  
  const startMonth = (quarter - 1) * 3;  
  const endMonth = startMonth + 2; // 季度包含3个月  
    
  // 计算当前季度的总天数  
  let daysInQuarter = 0;  
  for (let i = startMonth; i <= endMonth; i++) {  
      daysInQuarter += daysInMonth[i];  
  }  
    
  return daysInQuarter;  
}

export const getDateColumnWidthByViewMode = (viewMode: ViewMode, date: Date): number => {
  const curYear = date.getFullYear()

  let columnWidth = dayColumnWidthInViewMode[ViewMode.Day]

  if (viewMode === ViewMode.Year) {
    columnWidth = dayColumnWidthInViewMode[ViewMode.Year] * getDaysInYear(curYear)
  } else if (viewMode === ViewMode.QuarterYear) {
    columnWidth = dayColumnWidthInViewMode[ViewMode.QuarterYear] * getDaysInCurrentQuarter(date)
  } else if (viewMode === ViewMode.Month) {
    columnWidth = dayColumnWidthInViewMode[ViewMode.Month] * getDaysInMonth(date.getMonth(), curYear)
  } else if (viewMode === ViewMode.Week) {
    columnWidth = dayColumnWidthInViewMode[ViewMode.Week] * 7
  }

  return columnWidth
}

export const getDateIsActive = (date: Date, viewMode: ViewMode): boolean => {
  const now = new Date()
  const nowStartDate = startOfDate(now, "day")

  if (viewMode === ViewMode.Year) {
    return nowStartDate.getFullYear() === date.getFullYear()
  } else if (viewMode === ViewMode.QuarterYear) {
    return nowStartDate.getFullYear() === date.getFullYear() && getQuarter(nowStartDate) === getQuarter(date)
  } else if (viewMode === ViewMode.Month) {
    return nowStartDate.getFullYear() === date.getFullYear() && nowStartDate.getMonth() === date.getMonth()
  } else if (viewMode === ViewMode.Week) {
    const oneWeekTime = 604800000 // 一周的毫秒数 60 * 60 * 24 * 1000 * 7

    // 拿当前的时间比较，当前的时间 - 当周开始的时候小于一周的毫秒数的时候，那么就认为当前时间在当周内 
    if((+date) < (+now)) {
      return ((+now) - (+date) < oneWeekTime)
    }

    return false
  } else {
    return +nowStartDate === +date
  }
} 
