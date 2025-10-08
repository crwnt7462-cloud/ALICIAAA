import React, { Suspense } from 'react';

interface LazyPageProps {
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

export const LazyPage: React.FC<LazyPageProps> = ({ children }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

// Helper function to create lazy components
export const createLazyComponent = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  const LazyComponent = React.lazy(importFn);
  
  return (props: any) => (
    <LazyPage>
      <LazyComponent {...props} />
    </LazyPage>
  );
};