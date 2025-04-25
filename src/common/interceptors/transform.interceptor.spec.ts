import { TransformInterceptor } from './transform.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformInterceptor', () => {
  it('should transform response', (done) => {
    const interceptor = new TransformInterceptor();
    const context = {} as ExecutionContext;
    const next: CallHandler = {
      handle: () => of({ message: 'test' }),
    };

    interceptor.intercept(context, next).subscribe((response) => {
      expect(response).toEqual({
        success: true,
        message: 'Successfull',
        data: { message: 'test' },
      });
      done();
    });
  });
});
