
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {  
  let timeout: NodeJS.Timeout | null = null;  
  return ((...args: Parameters<T>) => {  
    const context = this;  
    const later = () => {  
      timeout = null;  
      func.apply(context, args);  
    };  
  
    const callNow = !timeout;  
    clearTimeout(timeout as NodeJS.Timeout);  
    timeout = setTimeout(later, wait);  
  
    if (callNow) {  
      func.apply(context, args);  
    }  
  }) as T;  
}

export { debounce }

const warned: Record<string, boolean> = {}

export const devWarning = (valid: boolean, component: string, message: string): void => {
  if (process.env.NODE_ENV !== 'production' && valid && !warned[message]) {
    warned[message] = true
    console.warn(`Warning: [kdesign]-${component}: ${message}`)
  }
}
