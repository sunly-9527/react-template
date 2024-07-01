export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

export interface Interceptor {
  onRequest?: (url: string, options: FetchOptions) => FetchOptions;
  onResponse?: <T>(response: T) => T;
  onError?: (error: any) => any;
}