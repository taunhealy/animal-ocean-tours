import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Animal Ocean | Marine Adventures & Conservation",
  description:
    "Learn about Animal Ocean's mission, our team, and our commitment to responsible marine tourism and ocean conservation.",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative h-[50vh] w-full overflow-hidden rounded-xl">
          <Image
            src="/images/about-hero.jpg"
            alt="Animal Ocean team on a boat"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
              About Animal Ocean
            </h1>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg mb-4">
          Animal Ocean is dedicated to providing unforgettable marine
          experiences while promoting ocean conservation and education. We
          believe that by connecting people with marine life, we can inspire a
          deeper appreciation for our oceans and the creatures that call them
          home.
        </p>
        <p className="text-lg">
          Founded in 2007, we have grown from a small local operation to a
          respected name in marine tourism, known for our ethical approach and
          commitment to sustainability.
        </p>
      </section>

      {/* Values Section */}
      <section className="mb-16 grid md:grid-cols-3 gap-8">
        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Responsible Tourism</h3>
          <p>
            We practice and promote responsible interaction with marine life,
            ensuring minimal impact on natural behaviors and habitats.
          </p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Education</h3>
          <p>
            Every adventure includes an educational component, helping guests
            understand marine ecosystems and conservation challenges.
          </p>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">Conservation</h3>
          <p>
            We actively participate in and support marine conservation efforts,
            from beach cleanups to research partnerships.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col">
              <div className="relative h-80 w-full mb-4 overflow-hidden rounded-lg">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-slate-600 mb-2">{member.role}</p>
              <p>{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conservation Efforts */}
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Our Conservation Efforts</h2>
        <p className="text-lg mb-6">
          At Animal Ocean, conservation isn't just a buzzword—it's at the core
          of everything we do. Here are some of the initiatives we're proud to
          be part of:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-lg">
          <li>
            Partnering with marine biologists to collect data on local seal
            populations
          </li>
          <li>Monthly beach and ocean cleanup events open to the community</li>
          <li>Educational programs for local schools</li>
          <li>Supporting research on marine ecosystem health</li>
          <li>Advocating for marine protected areas</li>
        </ul>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white p-8 md:p-12 rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">Join Us On The Water</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Experience the magic of the ocean with our expert guides. Book your
          adventure today and become part of our conservation story.
        </p>
        <Link
          href="/tours"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          Explore Our Tours
        </Link>
      </section>
    </main>
  );
}

const teamMembers = [
  {
    name: "Steve Benjamin",
    role: "Founder & Lead Guide",
    image: "/images/team/steve.jpg",
    bio: "Marine biologist with over 15 years of experience studying Cape fur seals and other marine mammals.",
  },
  {
    name: "Lisa Johnson",
    role: "Marine Educator",
    image: "/images/team/lisa.jpg",
    bio: "Former marine science teacher who specializes in creating engaging educational experiences for guests of all ages.",
  },
  {
    name: "Michael Ndlovu",
    role: "Boat Captain",
    image: "/images/team/michael.jpg",
    bio: "Experienced captain with an intimate knowledge of local waters and a passion for marine conservation.",
  },
  {
    name: "Sarah Williams",
    role: "Conservation Director",
    image: "/images/team/sarah.jpg",
    bio: "Leads our conservation initiatives and partnerships with research organizations and community groups.",
  },
  {
    name: "David Chen",
    role: "Underwater Photographer",
    image: "/images/team/david.jpg",
    bio: "Award-winning photographer who documents our encounters and contributes to our visual research database.",
  },
  {
    name: "Olivia Khumalo",
    role: "Operations Manager",
    image: "/images/team/olivia.jpg",
    bio: "Ensures all our tours run smoothly while maintaining our high standards for safety and sustainability.",
  },
];
