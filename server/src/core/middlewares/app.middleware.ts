import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const now = Date.now();
    const { method, baseUrl } = request;

    response.on('close', () => {
      const { statusCode } = response;
      const delay = Date.now() - now;
      this.logger.log(`${method} ${baseUrl} ${statusCode} ${delay}ms`);
    });

    next();
  }
}
