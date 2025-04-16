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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

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
}

interface RiderInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function BookingForm({
  tourId,
  schedules,
  basePrice,
}: BookingFormProps) {
  const { data: session } = useSession();
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [participants, setParticipants] = useState<string>("1");
  const [step, setStep] = useState<"select" | "details">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [activeRider, setActiveRider] = useState("0");

  // Form data for primary contact (booking creator)
  const [primaryContact, setPrimaryContact] = useState<RiderInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Form data for additional riders
  const [additionalRiders, setAdditionalRiders] = useState<RiderInfo[]>([]);

  // Pre-fill user data if logged in - simplified to use session data directly
  useEffect(() => {
    if (session?.user) {
      // Extract name parts if available
      let firstName = "";
      let lastName = "";

      if (session.user.name) {
        const nameParts = session.user.name.split(" ");
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(" ");
      }

      setPrimaryContact({
        firstName: firstName,
        lastName: lastName,
        email: session.user.email || "",
        phone: "",
      });
    }
  }, [session]);

  // Get the selected schedule object
  const selectedScheduleData = schedules.find((s) => s.id === selectedSchedule);

  // Calculate total price - fix the price calculation
  const totalPrice =
    selectedScheduleData && selectedScheduleData.price
      ? Number(selectedScheduleData.price)
      : Number(basePrice);

  const calculatedTotal = totalPrice * parseInt(participants);

  console.log("Base price:", basePrice);
  console.log("Selected schedule price:", selectedScheduleData?.price);
  console.log("Participants:", participants);
  console.log("Calculated total price:", calculatedTotal);

  // Update additional riders array when participant count changes
  const updateAdditionalRiders = (count: number) => {
    const currentCount = additionalRiders.length;
    if (count > currentCount) {
      // Add empty rider objects
      const newRiders = [...additionalRiders];
      for (let i = currentCount; i < count; i++) {
        newRiders.push({ firstName: "", lastName: "", email: "", phone: "" });
      }
      setAdditionalRiders(newRiders);
    } else if (count < currentCount) {
      // Remove excess rider objects
      setAdditionalRiders(additionalRiders.slice(0, count));
    }
  };

  const handleParticipantsChange = (value: string) => {
    setParticipants(value);
    const count = parseInt(value) - 1; // Subtract 1 for primary contact
    updateAdditionalRiders(count);
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return;

    // Initialize additional riders array based on participant count
    const count = parseInt(participants) - 1; // Subtract 1 for primary contact
    updateAdditionalRiders(count);

    setStep("details");
  };

  const handleBack = () => {
    setStep("select");
  };

  const handlePrimaryContactChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPrimaryContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdditionalRiderChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setAdditionalRiders((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would normally submit the booking to your API
      // For now, we'll just simulate a successful booking
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setBookingComplete(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            setPrimaryContact({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
            });
            setAdditionalRiders([]);
          }}
          variant="outline"
        >
          Book Another Tour
        </Button>
      </div>
    );
  }

  if (step === "details") {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 font-primary">
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

        <Tabs
          value={activeRider}
          onValueChange={setActiveRider}
          defaultValue="0"
          className="w-full"
        >
          <TabsList className="w-full mb-4">
            <TabsTrigger value="0" className="flex-1" title="Primary Contact">
              Primary Contact
            </TabsTrigger>
            {additionalRiders.map((_, index) => (
              <TabsTrigger
                key={index}
                value={(index + 1).toString()}
                className="flex-1"
                title={`Rider ${index + 2}`}
              >
                Rider {index + 2}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="0">
            <div className="space-y-4">
              <h3 className="font-medium">Primary Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={primaryContact.firstName}
                    onChange={handlePrimaryContactChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={primaryContact.lastName}
                    onChange={handlePrimaryContactChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={primaryContact.email}
                    onChange={handlePrimaryContactChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={primaryContact.phone}
                    onChange={handlePrimaryContactChange}
                    required
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {additionalRiders.map((rider, index) => (
            <TabsContent key={index} value={(index + 1).toString()}>
              <div className="space-y-4">
                <h3 className="font-medium">Rider {index + 2} Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`rider${index + 1}FirstName`}>
                      First Name
                    </Label>
                    <Input
                      id={`rider${index + 1}FirstName`}
                      name="firstName"
                      value={rider.firstName}
                      onChange={(e) => handleAdditionalRiderChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`rider${index + 1}LastName`}>
                      Last Name
                    </Label>
                    <Input
                      id={`rider${index + 1}LastName`}
                      name="lastName"
                      value={rider.lastName}
                      onChange={(e) => handleAdditionalRiderChange(index, e)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`rider${index + 1}Email`}>Email</Label>
                    <Input
                      id={`rider${index + 1}Email`}
                      name="email"
                      type="email"
                      value={rider.email}
                      onChange={(e) => handleAdditionalRiderChange(index, e)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`rider${index + 1}Phone`}>Phone</Label>
                    <Input
                      id={`rider${index + 1}Phone`}
                      name="phone"
                      value={rider.phone}
                      onChange={(e) => handleAdditionalRiderChange(index, e)}
                      required
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 font-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Complete Booking"}
          </Button>
        </div>
      </form>
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
          <Select value={participants} onValueChange={handleParticipantsChange}>
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
            Continue to Booking
          </Button>
        </div>
      </div>
    </form>
  );
}
