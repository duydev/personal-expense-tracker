import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { BaseResponseDto } from '../dto/base-response.dto';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionReponse = exception.getResponse();

    const errorResponse = new BaseResponseDto({
      status: 'error',
      message:
        typeof exceptionReponse === 'object' && 'message' in exceptionReponse
          ? (exceptionReponse.message as string)
          : exception.message,
    });

    response.status(status).json(errorResponse);
  }
}
