import { useState, useCallback } from 'react';

const useForceUpdate = (): () => void => {
  const [, setTick] = useState<number>(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
};

export default useForceUpdate;
