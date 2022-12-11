import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // get request.rawHeaders
    const { rawHeaders } = ctx.switchToHttp().getRequest();

    return rawHeaders;
  },
);
