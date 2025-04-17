"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  id: string;
  label: string;
  href: string;
}

export function DashboardTabsNavigation({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  // Determine active tab based on current pathname
  const getActiveTab = () => {
    if (pathname.includes("/bookings/upcoming")) return "upcoming";
    if (pathname.includes("/bookings/past")) return "past";
    if (pathname.includes("/profile")) return "profile";
    if (pathname.includes("/tours")) return "tours";
    if (pathname.includes("/my-tours")) return "my-tours";
    if (pathname.includes("/users")) return "users";
    if (pathname.includes("/motorcycles")) return "motorcycles";
    if (pathname.includes("/schedule")) return "schedule";

    // Default to upcoming if no match
    return "upcoming";
  };

  const activeTab = getActiveTab();

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex flex-wrap space-x-8 gap-y-4">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } font-primary transition-colors`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
