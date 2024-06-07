import { useRef, useMemo, useState } from 'react';

const observer = <T extends Record<string, any>>(
  initialVal: T,
  cb: () => void
): T => {
  const proxy = new Proxy<T>(initialVal, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      return typeof res === 'object'
        ? observer(res, cb)
        : Reflect.get(target, key);
    },
    set(target, key, val) {
      const ret = Reflect.set(target, key, val);
      cb();
      return ret;
    },
  });

  return proxy;
};

const useReactive = <T extends Record<string, any>>(initialState: T): T => {
  const ref = useRef<T>(initialState);
  const [, setState] = useState({});

  const state = useMemo(() => {
    return observer(ref.current, () => {
      setState({});
    });
  }, []);
  return state;
};

export default useReactive;
