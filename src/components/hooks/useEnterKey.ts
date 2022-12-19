import { useEffect } from 'react';

export default function EnterKeyListener(isButtonEnabled: boolean, callbackToNextPage: Function) {
  useEffect(() => {
    const listener = (event: any) => {
      if (
        (event.key === 'Enter' || event.key === 'NumpadEnter') &&
        isButtonEnabled &&
        event.target.tagName !== 'TEXTAREA'
      ) {
        callbackToNextPage();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [isButtonEnabled]);
}
