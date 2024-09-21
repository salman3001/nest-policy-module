import { HttpException, HttpStatus } from '@nestjs/common';

export class NestPolicyError extends HttpException {
  constructor() {
    super('Unauthorized', HttpStatus.FORBIDDEN);
  }
}
