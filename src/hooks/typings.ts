import type { DependencyList } from 'react';

export type Service<TData, TParams extends any[]> = (
  ...args: TParams
) => Promise<TData>;

export type Subscribe = () => void;

export interface FetchState<TData, TParams extends any[]> {
  loading: boolean;
  params?: TParams;
  data?: TData;
  error?: Error;
}

export interface CachedData<TData = any, TParams = any> {
  data: TData;
  params: TParams;
  time: number;
}

export interface Options<TData, TParams extends any[]> {
  manual: boolean;

  onBefore?: (params: TParams) => void;
  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (e: Error, params: TParams) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;

  defaultParams?: TParams;

  // refreshDeps
  refreshDeps?: DependencyList;
  refreshDepsAction?: () => void;

  // loading delay
  loadingDelay?: number;

  // polling
  pollingInterval?: number;
  pollingWhenHidden?: boolean;
  pollingErrorRetryCount?: number;

  // refresh on window focus
  refreshOnWindowFocus?: boolean;
  focusTimespan?: number;

  // debounce
  debounceWait?: number;
  debounceLeading?: boolean;
  debounceTrailing?: boolean;
  debounceMaxWait?: number;

  // throttle
  throttleWait?: number;
  throttleLeading?: boolean;
  throttleTrailing?: boolean;

  // cache
  cacheKey?: string;
  cacheTime?: number;
  staleTime?: number;
  setCache?: (data: CachedData<TData, TParams>) => void;
  getCache?: (params: TParams) => CachedData<TData, TParams> | undefined;

  // retry
  retryCount?: number;
  retryInterval?: number;

  // ready
  ready?: boolean;
}

export interface PluginReturn<TData, TParams extends any[]> {
  onBefore?: (params: TParams) =>
    | ({
        stopNow?: boolean;
        returnNow?: boolean;
      } & Partial<FetchState<TData, TParams>>)
    | void;

  onRequest?: (
    service: Service<TData, TParams>,
    params: TParams
  ) => {
    servicePromise?: Promise<TData>;
  };

  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (e: Error, params: TParams) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
  onCancel?: () => void;
  onMutate?: (data: TData) => void;
}
