interface TourHighlightsProps {
  highlights: string[];
}

export default function TourHighlights({ highlights }: TourHighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Tour Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700">{highlight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
