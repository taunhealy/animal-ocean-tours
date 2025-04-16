import { DashboardTabsNavigation } from "@/app/components/dashboard/dashboard-tabs-navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role?.toLowerCase() || "customer";

  // Define tabs based on user role
  const getTabs = () => {
    const baseTabs = [
      {
        id: "upcoming",
        label: "Upcoming Bookings",
        href: `/dashboard/${userRole}/bookings/upcoming`,
      },
      {
        id: "past",
        label: "Past Bookings",
        href: `/dashboard/${userRole}/bookings/past`,
      },
      {
        id: "profile",
        label: "Profile",
        href: `/dashboard/${userRole}/profile`,
      },
    ];

    switch (userRole) {
      case "admin":
        return [
          ...baseTabs,
          {
            id: "tours",
            label: "Manage Tours",
            href: "/dashboard/admin/tours",
          },
          { id: "users", label: "Users", href: "/dashboard/admin/users" },
          {
            id: "bookings",
            label: "All Bookings",
            href: "/dashboard/admin/bookings",
          },
          {
            id: "motorcycles",
            label: "Motorcycles",
            href: "/dashboard/admin/motorcycles",
          },
        ];
      case "guide":
        return [
          ...baseTabs,
          { id: "my-tours", label: "My Tours", href: "/dashboard/guide/tours" },
          {
            id: "schedule",
            label: "Schedule",
            href: "/dashboard/guide/schedule",
          },
        ];
      case "customer":
      default:
        return baseTabs;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-h2 mb-6 font-primary">
        Welcome, {session.user.name || "Rider"}
      </h1>

      <DashboardTabsNavigation tabs={getTabs()} />

      {children}
    </div>
  );
}
