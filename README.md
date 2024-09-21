# Permission policies module for Nest Js

This module can be used to manage the user permissions. we can define simple policies and register them in any nest module and inject policyService. (some inspirations from adonis js bouncer package)

### Instructions

- Install module

```typescript
 npm i @salman3001/nest-policy-module
```

- import policy modules in any other module and register a policy.

```typescript
import { PolicyModule } from '@salman3001/nest-policy-module';
import { myPolicy } from './policies'


imports: [
  PolicyModule.register([
    { token: 'MyPolicy', policy: myPolicy },
    { token: 'SomeOtherPolicy', policy: someOtherPolicy }
  ])
  ],

```

- you can create a policy as below. (keep related policies in the related modules)
- policy object must contain only functions those returns boolean value only

```typescript
const myPolicy = {
  isAdmin: (user: any) => user.role === 'admin',
  view: (user: any, resource: any) => {
    return resource.userId === user.id;
  },
};

export type IMypolicy = typeof myPolicy; // <-- export the type from here as it will be used while injecting service
```

- inject service in any class in the same module

```typescript
import { PolicyService } from '@salman3001/nest-policy-module';
import { myPolicy } from './policies';

export class UserService {
  constructor(
    @Inject('MyPolicy')
    private readonly policyService: PolicyService<IMypolicy>, // provide generic for typehints,
  ) {}

  anyMethod() {
    await this.policyService.authorize('isAdmin', { role: 'admin' });

    // or
    await this.policyService.authorize('view', anyResource);
  }
}
```

- authorize method returns true if policy passes the provided logic otherwise throws NestPolicyError which extends HttpExceptions with unauthorized status code. You can catch this error in global exception filer like this

```typescript
import { NestPolicyError } from '@salman3001/nest-policy-module';

@Catch()
export class GlobalHttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof NestPolicyError) {
      const status = exception.getStatus();
      const message = exception.message;
      //.. return custom error
    }
  }
}
```

- type hints will be provided by typescript

- instruction are written in hurry. you may expect mistakes. please try to findout yourself
