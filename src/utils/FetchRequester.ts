import { Interceptor, FetchOptions } from './typings';

/**
 * A function that serves as a request interceptor.
 * @param {unknown} url - The URL for the request
 * @param {unknown} options - The options for the request
 * @return {unknown} The options for the request
 */

class FetchRequester {
  private interceptors: Interceptor[] = [];
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private throttleMap: Map<string, number> = new Map();
  private loading = false;

  use(interceptor: Interceptor) {
    this.interceptors.push(interceptor);
  }

  async request<T>(url: string, options: FetchOptions = {}): Promise<T> {
    this.loading = true;

    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        options = interceptor.onRequest(url, options);
      }
    }

    const now = Date.now();
    const lastRequestTime = this.throttleMap.get(url);
    if (lastRequestTime && now - lastRequestTime < 1000) {
      throw new Error('Request throttled');
    }
    this.throttleMap.set(url, now);

    const requestKey = `${options.method || 'GET'}:${url}`;
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey) as Promise<T>;
    }

    const requestPromise = fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    }).then(async response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      let data = await response.json();

      for (const interceptor of this.interceptors) {
        if (interceptor.onResponse) {
          data = interceptor.onResponse(data);
        }
      }

      return data as T;
    }).catch(error => {
      for (const interceptor of this.interceptors) {
        if (interceptor.onError) {
          error = interceptor.onError(error);
        }
      }
      throw error;
    }).finally(() => {
      this.pendingRequests.delete(requestKey);
      this.loading = false;
    });

    this.pendingRequests.set(requestKey, requestPromise);
    return requestPromise;
  }

  isLoading() {
    return this.loading;
  }
}

const client = new FetchRequester().use({
  onRequest: (url, options) => {
    console.log('Request Interceptor:', url, options);
    return options;
  },
  onResponse: response => {
    console.log('Response Interceptor:', response);
    return response;
  },
  onError: error => {
    console.error('Error Interceptor:', error);
    return error;
  },
});

(async () => {
  try {
    const response = await client.request<{ data: string }>('https://api.example.com/data', {
      method: 'GET',
    });
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
})();