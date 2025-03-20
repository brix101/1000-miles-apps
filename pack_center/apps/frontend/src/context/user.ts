import { UserResource } from '@/features/auth';
import { createContextAndHook } from '@/utils/createContextAndHook';

const [UserContext, useUserContext] = createContextAndHook<
  UserResource | null | undefined
>('UserContext');

export { UserContext, useUserContext };
