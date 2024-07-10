/*
 * @Author: jianhang_he jianhang_he@kingdee.com
 * @Date: 2024-02-20 16:05:14
 * @LastEditors: jianhang_he jianhang_he@kingdee.com
 * @LastEditTime: 2024-03-14 11:07:30
 * @FilePath: \gantt-task-react\src\components\other\horizontal-scroll.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { SyntheticEvent, forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import styles from "./horizontal-scroll.module.css";

export const HorizontalScroll: React.FC<{
  scroll: number;
  scrollWidth: number;
  offsetWidth: number;
  rtl: boolean;
  style?: object;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = forwardRef(({ scroll, scrollWidth, offsetWidth, rtl, style = {}, onScroll }, ref) => {

  const scrollRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => {
    return {
      getScrollDom () {
        return scrollRef.current
      }
    }
  }, [scrollRef])

  useEffect(() => {
    // @ts-ignore
    if (scrollRef.current && scrollRef.current.scrollLeft !== scroll) {
      // @ts-ignore
      scrollRef.current.scrollLeft = scroll;
    }
  }); // 不加依赖是因为篡改scrollLeft在左触底时会失效，需要强刷

  return (
    <div
      dir="ltr"
      style={{
        margin: rtl
          ? `0px ${offsetWidth}px 0px 0px`
          : `0px 0px 0px ${offsetWidth}px`,
        ...style
      }}
      className={styles.scrollWrapper}
      onScroll={onScroll}
      // @ts-ignore
      ref={scrollRef}
    >
      <div style={{ width: scrollWidth }} className={styles.scroll} />
    </div>
  );
});

HorizontalScroll.displayName = 'HorizontalScroll'