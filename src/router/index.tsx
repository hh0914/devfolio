import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const BlogListPage = lazy(() => import('@/pages/BlogListPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
);

function PageFallback() {
  return (
    <div className="mx-auto w-full max-w-container px-5 py-24 sm:px-8">
      <div className="h-3 w-32 animate-pulse rounded bg-subtle" />
      <div className="mt-5 h-8 w-64 animate-pulse rounded bg-subtle" />
    </div>
  );
}

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{node}</Suspense>;
}

const base = import.meta.env.BASE_URL;
const basename = base === '/' ? '/' : base.replace(/\/$/, '');

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: withSuspense(<HomePage />) },
        { path: 'projects', element: withSuspense(<ProjectsPage />) },
        { path: 'projects/:slug', element: withSuspense(<ProjectDetailPage />) },
        { path: 'blog', element: withSuspense(<BlogListPage />) },
        { path: 'blog/:slug', element: withSuspense(<BlogPostPage />) },
        { path: '*', element: withSuspense(<NotFoundPage />) },
      ],
    },
  ],
  { basename },
);
