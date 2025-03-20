import { useRoutes } from 'react-router-dom';

import { useUser } from '@/hooks/useUser';

import { lazyImport } from '@/utils/lazyImport';
import React from 'react';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

const { Page404 } = lazyImport(
  () => import('@/components/page-404'),
  'Page404',
);

export function AppRoutes() {
  const user = useUser();

  const filteredRoutes = React.useMemo(() => {
    return protectedRoutes.map((route) => {
      return {
        ...route,
        children: route.children.filter((childRoute) => {
          return !(
            childRoute.path.includes('config') &&
            user?.user?.permission !== 'admin'
          );
        }),
      };
    });
  }, [protectedRoutes, user]);

  const routes = user.isSignedIn ? filteredRoutes : publicRoutes;

  const element = useRoutes([
    ...routes,
    {
      path: '*',
      element: <Page404 />,
    },
  ]);

  return <>{element}</>;
}
