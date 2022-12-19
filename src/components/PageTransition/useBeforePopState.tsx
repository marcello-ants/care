import { useEffect } from 'react';
import { useRouter } from 'next/router';

let isPoppingState = false;
function handleBeforePopState() {
  isPoppingState = true;
  return true;
}

const useBeforePopState = () => {
  const router = useRouter();

  useEffect(() => {
    router.beforePopState(handleBeforePopState);
  }, []);

  useEffect(() => {
    if (isPoppingState) {
      isPoppingState = false;
    }
  }, [isPoppingState]);

  return { isPoppingState };
};

export default useBeforePopState;
