import { MutableRefObject } from 'react';
import { Service, Options, Subscribe, FetchState } from './typings';
import useLatest from './useLatest';
import useCreation from './useCreation';
import useUpdate from './useUpdate';
import useUnmount from './useUnmount';
import useMount from './useMount';
import useMemoizedFn from './useMemoizedFn';

import { isFunction } from '@/utils';

class Fetch<TData, TParams extends any[]> {
  count: number = 0;

  state: FetchState<TData, TParams> = {
    loading: false,
    params: undefined,
    data: undefined,
    error: undefined,
  };

  constructor(
    public serviceRef: MutableRefObject<Service<TData, TParams>>,
    public options: Options<TData, TParams>,
    public subscribe: Subscribe,
    public initState: Partial<FetchState<TData, TParams>> = {}
  ) {
    this.state = {
      ...this.state,
      loading: !options.manual,
      ...initState,
    };
  }

  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    this.subscribe();
  }

  async runAsync(...params: TParams): Promise<TData> {
    this.count += 1;
    const currentCount = this.count;

    this.setState({
      params,
      ...this.state,
      loading: true,
    });

    this.options.onBefore?.(params);

    try {
      const res = await this.serviceRef.current(...params);

      if (currentCount !== this.count) {
        return new Promise(() => {});
      }

      this.setState({
        data: res,
        error: undefined,
        loading: false,
      });

      this.options.onSuccess?.(res, params);

      this.options.onFinally?.(params, res, undefined);

      return res;
    } catch (error: any) {
      if (currentCount !== this.count) {
        // prevent run.then when request is canceled
        return new Promise(() => {});
      }

      this.setState({
        error,
        loading: false,
      });

      this.options.onError?.(error, params);

      this.options.onFinally?.(params, undefined, error);

      throw error;
    }
  }

  run(...params: TParams) {
    this.runAsync(...params).catch((error) => {
      if (!this.options.onError) {
        console.error(error);
      }
    });
  }

  cancel() {
    this.count += 1;
    this.setState({
      loading: false,
    });
  }

  refresh() {
    // @ts-ignore
    this.run(...(this.state.params || []));
  }

  refreshAsync() {
    // @ts-ignore
    return this.runAsync(...(this.state.params || []));
  }

  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    const targetData = isFunction(data) ? data(this.state.data) : data;
    this.setState({
      data: targetData,
    });
  }
}

const useRequest = <TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>
) => {
  const fetchOptions = {
    manual: options?.manual || false,
    ...options,
  };

  const serviceRef = useLatest(service);

  const update = useUpdate();

  const fetchInstance = useCreation(() => {
    return new Fetch<TData, TParams>(serviceRef, fetchOptions, update);
  }, []);

  fetchInstance.options = fetchOptions;

  useMount(() => {
    if (!options?.manual) {
      // useCachePlugin can set fetchInstance.state.params from cache when init
      const params = fetchInstance.state.params || options?.defaultParams || [];
      // @ts-ignore
      fetchInstance.run(...params);
    }
  });

  useUnmount(() => {
    fetchInstance.cancel();
  });

  return {
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    params: fetchInstance.state.params || [],
    // cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
    // refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
    // refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
    // runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
    // mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance)),
  };
};

export default useRequest;
