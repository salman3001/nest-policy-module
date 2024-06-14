import { DynamicModule, Module, NestModule } from '@nestjs/common';
import { PolicyService } from './policy.service';

type PolicyOptions = {
  token: string;
  policy: Record<string, (...args: any[]) => boolean>;
}[];

@Module({})
export class PolicyModule {
  static register(opt: PolicyOptions): DynamicModule {
    return {
      module: PolicyModule,
      providers: [
        ...opt.map((p) => ({
          provide: p.token,
          useValue: new PolicyService(p.policy),
        })),
      ],
      exports: [...opt.map((p) => p.token)],
    };
  }
}
