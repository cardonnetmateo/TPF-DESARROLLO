import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    
use(req: Request, _res: Response, next: NextFunction): void {
const ts = new Date().toISOString();
console.log(`[${ts}] ${req.method} ${req.originalUrl ?? req.url}`);
next();
}
}
