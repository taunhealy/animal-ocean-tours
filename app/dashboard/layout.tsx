import { DashboardTabsNavigation } from "@/app/components/dashboard/dashboard-tabs-navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

type Role = "admin" | "guide" | "customer";

interface TabConfig {
  id: string;
  label: string;
  href: string;
  roles: Role[];
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userRole = (session.user.role?.toLowerCase() as Role) || "customer";

  // Centralized tab configuration based on your file structure
  const TAB_CONFIG: TabConfig[] = [
    // Admin bookings
    {
      id: "admin-bookings",
      label: "Bookings Management",
      href: "/dashboard/admin/bookings",
      roles: ["admin"],
    },

    // Tours
    {
      id: "tours",
      label: "Tours Managements",
      href: "/dashboard/admin/tours",
      roles: ["admin"],
    },

    // Settings - likely admin only
    {
      id: "settings",
      label: "System Settings",
      href: "/dashboard/settings",
      roles: ["admin"],
    },

    // Reports - for admin and guides
    {
      id: "reports",
      label: "Analytics & Reports",
      href: "/dashboard/reports",
      roles: ["admin", "guide"],
    },

    // Pricing section
    {
      id: "pricing-promotions",
      label: "Promotions",
      href: "/dashboard/pricing/promotions",
      roles: ["admin"],
    },
    {
      id: "pricing-seasonal",
      label: "Seasonal Pricing",
      href: "/dashboard/pricing/seasonal",
      roles: ["admin"],
    },

    // Scheduling section
    {
      id: "scheduling-conflicts",
      label: "Schedule Conflicts",
      href: "/dashboard/scheduling/conflicts",
      roles: ["admin", "guide"],
    },
    {
      id: "scheduling-staff",
      label: "Staff Scheduling",
      href: "/dashboard/scheduling/staff",
      roles: ["admin"],
    },

    // Customer tabs
    {
      id: "my-bookings",
      label: "My Bookings",
      href: "/dashboard/customer/bookings",
      roles: ["customer"],
    },
    {
      id: "profile",
      label: "Profile",
      href: "/dashboard/profile",
      roles: ["admin", "guide", "customer"],
    },
  ];

  // Filter tabs based on user role
  const tabs = TAB_CONFIG.filter((tab) => tab.roles.includes(userRole));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-h2 mb-6 font-primary">
        Welcome, {session.user.name || "Explorer"}
      </h1>

      <DashboardTabsNavigation tabs={tabs} />

      {children}
    </div>
  );
}
