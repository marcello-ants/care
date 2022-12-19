// @ts-nocheck
import { useEffect, useState, useRef } from 'react';

function useResizeObserver(targetRef) {
  const [contentRect, setContentRect] = useState({
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const resizeObserver = useRef(null);

  function disconnect() {
    if (resizeObserver.current) {
      resizeObserver.current.disconnect();
    }
  }
  useEffect(() => {
    function observe(ResizeObserver) {
      resizeObserver.current = new ResizeObserver((entries) => {
        const { width, height, top, right, bottom, left } = entries[0].contentRect;
        setContentRect({ width, height, top, right, bottom, left });
      });
      if (targetRef.current) {
        resizeObserver.current.observe(targetRef.current);
      }
    }

    (async () => {
      if ('ResizeObserver' in window) {
        observe(ResizeObserver);
      } else {
        const { default: ResizeObserver } = await import('resize-observer-polyfill');
        observe(ResizeObserver);
      }
    })();

    return disconnect;
  }, [targetRef]);

  return contentRect;
}

export default useResizeObserver;
