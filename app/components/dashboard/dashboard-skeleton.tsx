export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>

      <div className="h-12 bg-gray-200 rounded mb-6"></div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="block p-4 rounded-lg bg-gray-50 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="w-full md:w-2/3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="w-full md:w-1/3 flex justify-end">
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
