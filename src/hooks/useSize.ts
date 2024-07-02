import ResizeObserver from 'resize-observer-polyfill';
import useEffectWithTarget from './useLayoutEffectWithTarget';
import useRafState from './useRefState';
import { getTargetElement } from '@/utils';
import { BasicTarget } from './typings';

type Size = {
  width: number;
  height: number;
};

const useSize = (target: BasicTarget): Size | undefined => {
  const [size, setSize] = useRafState<Size>();

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target);

      if (!el) {
        return;
      }

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { clientWidth, clientHeight } = entry.target;
          setSize({
            width: clientWidth,
            height: clientHeight,
          });
        });
      });

      resizeObserver.observe(el);
      return () => {
        resizeObserver.disconnect();
      };
    },
    [],
    target
  );

  return size;
};

export default useSize;
