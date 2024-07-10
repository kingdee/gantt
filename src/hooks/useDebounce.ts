import { useCallback, useEffect, useRef } from "react";

export default function useDebounce (fn: Function, delay?: number) {
  const {current} = useRef({fn, timer: 0 })
  useEffect(() => {
    current.fn = fn
  }, [fn])
  return useCallback((...args: any) => {
    if (current.timer) {
      clearTimeout(current.timer)
    }
    current.timer = window.setTimeout(() => {
      current.fn(...args)
    }, delay)
  }, [fn])
}