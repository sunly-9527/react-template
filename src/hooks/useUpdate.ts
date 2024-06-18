import { useCallback, useState } from 'react';

const useUpdate = () => {
  const [, setValue] = useState({});

  return useCallback(() => setValue({}), []);
};

export default useUpdate;
