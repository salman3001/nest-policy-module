import { Injectable } from '@nestjs/common';
import { NestPolicyError } from './exceptions/NestPolicyError';

@Injectable()
export class PolicyService<
  T extends Record<string, (...args: any[]) => boolean | Promise<boolean>>,
> {
  private policy: T;

  constructor(policy: T) {
    this.policy = policy;
  }

  async authorize<K extends keyof T>(
    policyKey: K,
    ...args: Parameters<T[K]>
  ): Promise<boolean> {
    const policyFunction = this.policy[policyKey];
    if (typeof policyFunction === 'function') {
      const isValid = await policyFunction(...args);
      if (!isValid) {
        throw new NestPolicyError();
      }
      return isValid;
    }
    throw new Error(`Policy function not found for key: ${String(policyKey)}`);
  }
}
