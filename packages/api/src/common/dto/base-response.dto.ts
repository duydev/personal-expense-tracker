export class BaseResponseDto<T> {
  status: 'success' | 'error';

  data: T;

  message?: string;

  meta?: Record<string, unknown>;

  constructor(partial: Partial<BaseResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
