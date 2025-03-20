import React from 'react';
import { Outlet } from 'react-router-dom';

import { MainLayout } from '@/components/layouts/main-layout';
import { Loader } from '@/components/loader/Loader';
import { ModalPortal } from '@/components/modal-portal';
import { lazyImport } from '@/utils/lazyImport';

const { AccountEmailRoutes } = lazyImport(
  () => import('@/features/account-emails'),
  'AccountEmailRoutes',
);

const { GroupRoutes } = lazyImport(
  () => import('@/features/groups'),
  'GroupRoutes',
);

const { SalesOrderRoutes } = lazyImport(
  () => import('@/features/sales-orders'),
  'SalesOrderRoutes',
);

const { AssortmentsRoutes } = lazyImport(
  () => import('@/features/assortments'),
  'AssortmentsRoutes',
);

const { CustomersRoutes } = lazyImport(
  () => import('@/features/customers'),
  'CustomersRoutes',
);

const { TemplatesRoutes } = lazyImport(
  () => import('@/features/templates'),
  'TemplatesRoutes',
);

const { UserRoutes } = lazyImport(
  () => import('@/features/users'),
  'UserRoutes',
);

const App = () => {
  return (
    <MainLayout>
      <React.Suspense
        fallback={
          <div className="d-flex align-items-center justify-content-center vh-100">
            <Loader />
          </div>
        }
      >
        <Outlet />
      </React.Suspense>
      <ModalPortal />
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/groups/*', element: <GroupRoutes /> },
      { path: '/Assortments/*', element: <AssortmentsRoutes /> },
      { path: '/sales-orders/*', element: <SalesOrderRoutes /> },
      { path: '/config/customers/*', element: <CustomersRoutes /> },
      { path: '/config/templates/*', element: <TemplatesRoutes /> },
      { path: '/users/*', element: <UserRoutes /> },
      { path: '/emails/*', element: <AccountEmailRoutes /> },
    ],
  },
];
