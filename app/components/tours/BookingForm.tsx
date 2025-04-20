"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  price: number;
  availableSpots: number;
  status: string;
}

interface BookingFormProps {
  tourId: string;
  schedules: Schedule[];
  basePrice: number;
  checkoutComponent: React.FC<{
    bookingData: {
      tourId: string;
      scheduleId: string;
      participants: number;
      totalPrice: number;
      contactInfo: ContactInfo;
    };
    onSuccess: (transactionId: string) => void;
    onError: (error: Error) => void;
  }>;
}

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

export default function BookingForm({
  tourId,
  schedules,
  basePrice,
  checkoutComponent: CheckoutComponent,
}: BookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedTour, setSelectedTour] = useState<{
    id: string;
    slug: string;
    name: string;
  }>();
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [participants, setParticipants] = useState<string>("1");
  const [step, setStep] = useState<"select" | "contact" | "checkout">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Contact information
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: "",
    email: "",
    phone: "",
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (session?.user) {
      setContactInfo({
        fullName: session.user.name || "",
        email: session.user.email || "",
        phone: "",
      });
    }
  }, [session]);

  // Get the selected schedule object
  const selectedScheduleData = schedules.find((s) => s.id === selectedSchedule);

  // Calculate total price
  const totalPrice =
    selectedScheduleData && selectedScheduleData.price
      ? Number(selectedScheduleData.price)
      : Number(basePrice);

  const calculatedTotal = totalPrice * parseInt(participants);

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) {
      toast.error("Please select a tour date");
      return;
    }

    setStep("contact");
  };

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate contact information
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone) {
      toast.error("Please fill in all contact information");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setStep("checkout");
  };

  const handleBack = () => {
    if (step === "contact") {
      setStep("select");
    } else if (step === "checkout") {
      setStep("contact");
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    toast.success("Payment successful! Your booking is confirmed.");
    setBookingComplete(true);
    router.refresh(); // Optional: Refresh any cached data
  };

  const handlePaymentError = (error: Error) => {
    console.error("Payment error:", error);
    toast.error(`Payment failed: ${error.message}`);
    setIsSubmitting(false);
  };

  if (bookingComplete) {
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          Booking Confirmed!
        </h3>
        <p className="text-green-600 mb-4">
          Thank you for your booking. We've sent a confirmation to your email.
        </p>
        <Button
          onClick={() => {
            setBookingComplete(false);
            setStep("select");
            setSelectedSchedule("");
            setContactInfo({
              fullName: "",
              email: "",
              phone: "",
            });
          }}
          variant="outline"
        >
          Book Another Tour
        </Button>
      </div>
    );
  }

  if (step === "contact") {
    return (
      <form
        onSubmit={handleProceedToCheckout}
        className="space-y-4 font-primary"
      >
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">Booking Summary</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="text-gray-500">Dates:</span>{" "}
              {formatDate(new Date(selectedScheduleData?.startDate || ""))} -{" "}
              {formatDate(new Date(selectedScheduleData?.endDate || ""))}
            </p>
            <p>
              <span className="text-gray-500">Participants:</span>{" "}
              {participants} {parseInt(participants) === 1 ? "rider" : "riders"}
            </p>
            <p>
              <span className="text-gray-500">Total:</span>{" "}
              {formatCurrency(calculatedTotal)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Primary Contact Information</h3>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={contactInfo.fullName}
              onChange={handleContactInfoChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contactInfo.email}
              onChange={handleContactInfoChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleContactInfoChange}
              required
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button type="submit" className="flex-1 font-primary">
            Continue to Checkout
          </Button>
        </div>
      </form>
    );
  }

  if (step === "checkout") {
    return (
      <div className="space-y-4 font-primary">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">Booking Summary</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="text-gray-500">Dates:</span>{" "}
              {formatDate(new Date(selectedScheduleData?.startDate || ""))} -{" "}
              {formatDate(new Date(selectedScheduleData?.endDate || ""))}
            </p>
            <p>
              <span className="text-gray-500">Participants:</span>{" "}
              {participants} {parseInt(participants) === 1 ? "rider" : "riders"}
            </p>
            <p>
              <span className="text-gray-500">Contact:</span>{" "}
              {contactInfo.fullName}
            </p>
            <p>
              <span className="text-gray-500">Total:</span>{" "}
              {formatCurrency(calculatedTotal)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <CheckoutComponent
            bookingData={{
              tourId,
              scheduleId: selectedSchedule,
              participants: parseInt(participants),
              totalPrice: calculatedTotal,
              contactInfo: {
                fullName: contactInfo.fullName,
                email: contactInfo.email,
                phone: contactInfo.phone,
              },
            }}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />

          <p className="text-xs text-gray-500 text-center">
            By completing this payment, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          className="w-full mt-2"
        >
          Back to Contact Information
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleContinue} className="font-primary">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tour Date
          </label>
          <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <SelectItem
                    key={schedule.id}
                    value={schedule.id}
                    disabled={schedule.availableSpots <= 0}
                  >
                    {formatDate(new Date(schedule.startDate))} -{" "}
                    {formatDate(new Date(schedule.endDate))} (
                    {schedule.availableSpots} spots left)
                    {schedule.status !== "OPEN" && ` - ${schedule.status}`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No available dates
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Participants
          </label>
          <Select value={participants} onValueChange={setParticipants}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Number of riders" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "rider" : "riders"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full font-primary"
            disabled={!selectedSchedule}
          >
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
