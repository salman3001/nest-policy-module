import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NestPolicyError } from './exceptions/NestPolicyError';

@Injectable()
export class PolicyService<
  T extends Record<string, (...args: any[]) => boolean>,
> {
  private policy: T;

  constructor(policy: T) {
    this.policy = policy;
  }

  authorize<K extends keyof T>(
    policyKey: K,
    ...args: Parameters<T[K]>
  ): boolean {
    const policyFunction = this.policy[policyKey];
    if (typeof policyFunction === 'function') {
      const isValid = policyFunction(...args);
      if (!isValid) {
        throw new NestPolicyError();
      }
      return isValid;
    }
    throw new Error(`Policy function not found for key: ${String(policyKey)}`);
  }
}
