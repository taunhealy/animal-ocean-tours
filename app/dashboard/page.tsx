import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Get role from session (now populated from database)
  const userRole = session.user.role?.toLowerCase() || "customer";

  // Map roles to existing folder paths
  const roleRoutes = {
    admin: "/dashboard/admin",
    guide: "/dashboard/guide/",
    customer: "/dashboard/customer/",
  };

  // Redirect to existing static route
  const redirectPath =
    roleRoutes[userRole as keyof typeof roleRoutes] || roleRoutes.customer;
  redirect(redirectPath);
}
