import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Anchor, Fish, Camera } from "lucide-react";
import { prisma } from "@/lib/prisma";

// Fetch featured tours
async function getFeaturedTours() {
  return await prisma.tour.findMany({
    where: {
      published: true,
    },
    take: 3,
    include: {
      locationDetails: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function Home() {
  const featuredTours = await getFeaturedTours();

  return (
    <div className="min-h-screen font-primary">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Discover the Wonders of Cape Town's Ocean
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
              Animal Ocean provides intimate marine wildlife experiences for
              everyone. From ocean safaris to seal kayaking, we bring you closer
              to the incredible marine life of South Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tours"
                className="rounded-full bg-blue-600 text-white px-8 py-3 font-medium hover:bg-blue-700 transition-colors"
              >
                Explore Experiences
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-gray-300 px-8 py-3 font-medium hover:bg-gray-50 transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="/hero-ocean-safari.jpg"
              alt="Ocean safari with dolphins in Cape Town"
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Our Specialties Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Specialties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From thrilling ocean safaris to peaceful seal kayaking adventures,
              we offer unique marine experiences for all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-56">
                  <Image
                    src={specialty.image}
                    alt={specialty.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {specialty.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{specialty.description}</p>
                  <Link
                    href={specialty.link}
                    className="text-blue-600 font-medium hover:underline flex items-center"
                  >
                    Learn More <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 md:py-32 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About Animal Ocean
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We want to share our passion for the ocean and its creatures
                with you! Animal Ocean provides intimate marine wildlife
                experiences for everyone. From the first email to the departing
                handshake, we aim to give honest advice and thorough planning to
                provide you with unforgettable marine wildlife experiences.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Through knowledgeable guides and great equipment, we will share
                our love for the ocean with you, as we see it!
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We offer incredible marine wildlife encounters, from snorkelling
                day trips to photographic diving expeditions. We will help you
                plan and execute your ultimate ocean experience or shoot, making
                sure you are in the right place at the right time.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-blue-600 font-medium hover:underline"
              >
                Read More About Us <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/about-animal-ocean.jpg"
                alt="Animal Ocean team with marine wildlife"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Experiences
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular marine adventures and start planning
              your next ocean journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-56">
                  <Image
                    src={tour.images[0] || "/placeholder-tour.jpg"}
                    alt={tour.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{tour.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {tour.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      ${Number(tour.basePrice).toFixed(2)}
                    </span>
                    <Link
                      href={`/tours/${tour.id}`}
                      className="text-blue-600 font-medium hover:underline flex items-center"
                    >
                      View Details <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="inline-flex items-center rounded-full bg-gray-100 px-6 py-3 font-medium hover:bg-gray-200 transition-colors"
            >
              View All Experiences <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Animal Ocean
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for an unforgettable marine
              adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready for Your Ocean Adventure?
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl">
              Join us for an unforgettable marine wildlife experience in the
              beautiful waters of Cape Town.
            </p>
            <Link
              href="/tours"
              className="rounded-full bg-white text-blue-600 px-8 py-3 font-medium hover:bg-gray-100 transition-colors flex items-center"
            >
              Book Your Experience <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-black">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-black">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marine-life"
                    className="text-gray-600 hover:text-black"
                  >
                    Marine Life Guide
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-black">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-black"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-gray-600 hover:text-black"
                  >
                    Our Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-black"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/partners"
                    className="text-gray-600 hover:text-black"
                  >
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-black"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-black"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/safety"
                    className="text-gray-600 hover:text-black"
                  >
                    Safety Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="/conservation"
                    className="text-gray-600 hover:text-black"
                  >
                    Conservation Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image
                src="/logo.svg"
                alt="Animal Ocean Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Animal Ocean. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sample data
const specialties = [
  {
    title: "Ocean Safaris",
    description:
      "Encounter South Africa's incredible marine megafauna, from dolphins and whales to sunfish and seabirds.",
    image: "/ocean-safari.jpg",
    link: "/tours/ocean-safaris",
  },
  {
    title: "Seal Kayaking",
    description:
      "Paddle alongside playful Cape fur seals in their natural habitat for a peaceful and intimate wildlife experience.",
    image: "/seal-kayaking.jpg",
    link: "/tours/seal-kayaking",
  },
  {
    title: "Sardine Run",
    description:
      "Witness one of the world's greatest marine migrations during this spectacular annual event.",
    image: "/sardine-run.jpg",
    link: "/tours/sardine-run",
  },
];

const features = [
  {
    icon: <Anchor className="w-6 h-6 text-blue-600" />,
    title: "Expert Marine Guides",
    description:
      "Our knowledgeable guides share their passion and expertise about marine wildlife and ocean conservation.",
  },
  {
    icon: <Camera className="w-6 h-6 text-blue-600" />,
    title: "Photography Opportunities",
    description:
      "Perfect for everyone from casual photographers to National Geographic professionals seeking unique shots.",
  },
  {
    icon: <Fish className="w-6 h-6 text-blue-600" />,
    title: "Diverse Marine Encounters",
    description:
      "Experience Cape Town's unique marine biodiversity with opportunities to see various ocean creatures.",
  },
];
