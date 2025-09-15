import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponseDto } from '../dto/base-response.dto';

export class HttpResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseResponseDto<unknown>> {
    return next.handle().pipe(
      map((data: unknown) => {
        if (data instanceof BaseResponseDto) {
          return data;
        }

        const payload: BaseResponseDto<unknown> = {
          status: 'success',
          data,
        };

        if (data && typeof data === 'object') {
          if ('message' in data) {
            payload.message = data.message as string;
            payload.data = undefined;
          }

          if ('data' in data) {
            const { data: items, ...meta } = data;
            payload.data = items;

            if ('total' in data) {
              payload.meta = meta;
            }
          }
        }

        return new BaseResponseDto(payload);
      }),
    );
  }
}
