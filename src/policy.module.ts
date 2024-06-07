import { DynamicModule, Module, NestModule } from '@nestjs/common';
import { PolicyService } from './policy.service';

@Module({})
export class PolicyModule {
  static register(
    policy: Record<string, (...args: any[]) => boolean>,
  ): DynamicModule {
    return {
      module: PolicyModule,
      providers: [
        { provide: PolicyService, useValue: new PolicyService(policy) },
      ],
      exports: [PolicyService],
    };
  }
}
