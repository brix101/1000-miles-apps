import { lazyImport } from '@/utils/lazyImport';

const { SignIn } = lazyImport(() => import('@/features/auth'), 'SignIn');

export const publicRoutes = [
  {
    path: '/',
    element: <SignIn />,
  },
];
