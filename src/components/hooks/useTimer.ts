import { useEffect } from 'react';

export default function useTimer(callback: Function, timeout: number, deps?: Array<any>) {
  const dl = Array.isArray(deps) ? deps : [];
  useEffect(() => {
    const timer = setTimeout(callback, timeout);
    return () => {
      clearTimeout(timer);
    };
  }, dl);
}
