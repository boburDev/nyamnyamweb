import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface RetryableRequest {
  config: AxiosRequestConfig;
  retry: () => Promise<AxiosResponse>;
}

interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: AxiosError) => void;
}

export class RequestQueue {
  private queue: QueueItem[] = [];
  private _isRefreshing = false;

  constructor() {}

  add(request: RetryableRequest): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject });
    }).then((token) => {
      if (token) {
        request.config.headers = {
          ...request.config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return request.retry();
    });
  }

  processAll(token: string | null) {
    this.queue.forEach((item) => item.resolve(token));
    this.clear();
  }

  rejectAll(error: AxiosError) {
    this.queue.forEach((item) => item.reject(error));
    this.clear();
  }

  clear() {
    this.queue = [];
  }

  get isRefreshing() {
    return this._isRefreshing;
  }

  set isRefreshing(status: boolean) {
    this._isRefreshing = status;
  }
}

export const requestQueue = new RequestQueue();
