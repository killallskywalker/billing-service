import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponseDto } from '../dto/api-response.dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponseDto<T>>
{
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseDto<T>> {
    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        message: 'Successfull',
        data,
      })),
    );
  }
}
