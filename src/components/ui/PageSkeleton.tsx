import React from 'react';

export const PageSkeleton: React.FC<{ variant?: 'dashboard' | 'public' }> = ({
  variant = 'dashboard',
}) => {
  if (variant === 'public') {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 animate-pulse"
        role="status"
        aria-label="Loading page content"
      >
        <div className="space-y-4 max-w-2xl">
          <div className="h-4 w-40 rounded bg-[#D6B878]/20" />
          <div className="h-12 w-full rounded-xl bg-current/10" />
          <div className="h-5 w-3/4 rounded bg-current/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 rounded-3xl bg-current/5 border border-current/10 p-6 flex flex-col justify-between"
            >
              <div className="h-5 w-1/2 rounded bg-current/10" />
              <div className="h-28 w-full rounded-2xl bg-current/10" />
              <div className="h-9 w-full rounded-xl bg-[#D6B878]/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 pb-12 animate-pulse"
      role="status"
      aria-label="Synchronizing financial telemetry"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-48 rounded bg-[#D6B878]/25" />
          <div className="h-8 w-72 rounded-lg bg-current/10" />
        </div>
        <div className="h-9 w-36 rounded-xl bg-[#D6B878]/25" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="sm:col-span-2 h-36 rounded-2xl bg-current/10 border border-current/10" />
        <div className="h-36 rounded-2xl bg-current/5 border border-current/10" />
        <div className="h-36 rounded-2xl bg-current/5 border border-current/10" />
        <div className="h-36 rounded-2xl bg-current/5 border border-current/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-80 rounded-3xl bg-current/5 border border-current/10" />
        <div className="lg:col-span-4 h-80 rounded-3xl bg-current/5 border border-current/10" />
      </div>
    </div>
  );
};
