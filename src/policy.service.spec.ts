import { Test, TestingModule } from '@nestjs/testing';
import { PolicyModule } from './policy.module';
import { PolicyService } from './policy.service';
import { HttpException } from '@nestjs/common';

describe('ConfigService', () => {
  const myPolicy = {
    isAdmin: (user: any) => user.role === 'admin',
    hasPermission: (user: any, resource: any) => {
      return resource.userId === user.id;
    },
  };

  let service: PolicyService<typeof myPolicy>;
  let service2: PolicyService<typeof myPolicy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PolicyModule.register([
          { token: 'MyPolicy', policy: myPolicy },
          { token: 'myAnotherPolicy', policy: myPolicy },
        ]),
      ],
    }).compile();

    service = module.get('MyPolicy');
    service2 = module.get('myAnotherPolicy');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service2).toBeDefined();
  });

  it('should fail', () => {
    expect.assertions(1);
    try {
      service.authorize('isAdmin', { role: 'customer' });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
    }
  });

  it('should pass', () => {
    expect(
      service.authorize('hasPermission', { id: 1 }, { userId: 1 }),
    ).toBeTruthy();
    expect(
      service2.authorize('hasPermission', { id: 1 }, { userId: 1 }),
    ).toBeTruthy();
  });
});
