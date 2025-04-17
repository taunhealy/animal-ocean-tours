import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TourForm from "@/app/components/tours/TourForm";
import { authOptions } from "@/lib/auth";

export default async function NewTourPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/signin?callbackUrl=/dashboard/admin/tours");
  }

  return (
    <div className="container py-8 font-primary">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Tour</h1>
        </div>

        <div className="card p-6">
          <TourForm />
        </div>
      </div>
    </div>
  );
}
