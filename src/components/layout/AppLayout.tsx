import { ReactNode } from "react";

interface AppLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  panel?: ReactNode;
}

export default function AppLayout({ sidebar, main, panel }: AppLayoutProps) {
  return (
    <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {sidebar}
      </div>

      <div className="flex-1 relative">
        {main}

        {panel && <div className="absolute top-4 right-4 z-10">{panel}</div>}
      </div>
    </div>
  );
}
