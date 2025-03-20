import { useUserContext } from '@/context/user';
import { UserResource } from '@/features/auth/types';
import { useAssertWrappedByAuthProvider } from '@/providers/AuthContextProvider';

type UseUserReturn =
  | { isLoaded: false; isSignedIn: undefined; user: undefined }
  | { isLoaded: true; isSignedIn: false; user: null }
  | { isLoaded: true; isSignedIn: true; user: UserResource };

/**
 * Returns the current auth state and if a user is signed in, the user object.
 *
 * Until Clerk loads and initializes, `isLoaded` will be set to `false`.
 * Once Clerk loads, `isLoaded` will be set to `true`, and you can
 * safely access `isSignedIn` state and `user`.
 *
 * @example
 * A simple example:
 *
 * import { useUser } from '@hooks/useUser'
 *
 * function Hello() {
 *   const { isSignedIn, user } = useUser();
 *   if(!isSignedIn) {
 *     return null;
 *   }
 *   return <div>Hello, {user.firstName}</div>
 * }
 */
export function useUser(): UseUserReturn {
  useAssertWrappedByAuthProvider('useUser');

  const user = useUserContext();

  if (user === undefined) {
    return { isLoaded: false, isSignedIn: undefined, user: undefined };
  }

  if (user === null) {
    return { isLoaded: true, isSignedIn: false, user: null };
  }

  return { isLoaded: true, isSignedIn: true, user };
}
