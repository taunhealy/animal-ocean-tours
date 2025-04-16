import { Metadata } from "next";
import ContactForm from "../components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us | Off The Grid",
  description:
    "Get in touch with our team for any questions or inquiries about our services.",
};

export default function ContactPage() {
  return (
    <div className="container max-w-4xl py-12 md:py-16">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground">
          Have questions or feedback? We'd love to hear from you. Fill out the
          form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:mt-2">
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-xl font-semibold">Our Location</h3>
            <p className="text-muted-foreground">
              123 Adventure Street
              <br />
              Copenhagen, 2100
              <br />
              Denmark
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">Contact Information</h3>
            <p className="text-muted-foreground">
              Email: info@offthegrid.com
              <br />
              Phone: +45 12 34 56 78
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">Business Hours</h3>
            <p className="text-muted-foreground">
              Monday - Friday: 9:00 AM - 5:00 PM
              <br />
              Saturday: 10:00 AM - 4:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
