import { message } from 'antd'

type FetchOptions = RequestInit & { cacheKey?: string }
class CreateFetchInterceptors {
  private cache: Map<string, any>

  constructor() {
    this.cache = new Map<string, any>()
  }

  private requestInterceptor(options: FetchOptions): FetchOptions {
    return options
  }

  private responseInterceptor(response: Response): Response {
    return response
  }

  checkCache(cacheKey: string | undefined): any {
    if (cacheKey && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    return null
  }

  private setCache(cacheKey: string | undefined, data: any): void {
    if (cacheKey) {
      this.cache.set(cacheKey, data)
    }
  }

  public async request(url: string, options: FetchOptions = {}): Promise<any> {
    const cachedResponse = this.checkCache(options?.cacheKey)
    if (cachedResponse) {
      return Promise.resolve(cachedResponse)
    }
    const modifiedOptions = this.requestInterceptor(options)
    try {
      const response = await fetch(url, modifiedOptions)
      const interceptedResponse = this.responseInterceptor(response)
      if (!interceptedResponse.ok) {
        throw new Error(`HTTP error! Status: ${interceptedResponse.status}`)
      }
      const data = await interceptedResponse.json()
      this.setCache(options.cacheKey, data)
      return data
    } catch (error) {
      message.error(`请求失败: ${error}.`)
      throw error
    }
  }
}

const FetchRequester = new CreateFetchInterceptors()

export default FetchRequester
