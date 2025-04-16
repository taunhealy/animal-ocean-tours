import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export function Hero() {
  return (
    <div className="relative bg-gray-900 text-white">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-motorcycle.jpg" // Replace with your actual hero image
          alt="Motorcycle adventure"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Discover the World on Two Wheels
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Experience unforgettable motorcycle adventures with expert guides,
            premium bikes, and breathtaking routes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg">
              <Link href="/tours">Explore Tours</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/motorcycles">View Motorcycles</Link>
            </Button>
          </div>

          {/* Tour Highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
              <p>
                Ride with experienced local guides who know every twist and
                turn.
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                Premium Motorcycles
              </h3>
              <p>
                Choose from our fleet of well-maintained adventure and touring
                bikes.
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Stunning Routes</h3>
              <p>
                Discover breathtaking landscapes and hidden gems off the beaten
                path.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
