"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { BookingsListSkeleton } from "./BookingsListSkeleton";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { CalendarIcon, MapPinIcon } from "lucide-react";

// Mock data - replace with actual API call
const mockBookings = [
  {
    id: "1",
    propertyName: "Mountain Cabin Retreat",
    location: "Blue Ridge Mountains, NC",
    checkIn: new Date("2023-11-15"),
    checkOut: new Date("2023-11-20"),
    status: "upcoming",
    totalPrice: 750,
    imageUrl: "/images/cabin.jpg",
  },
  {
    id: "2",
    propertyName: "Lakeside Cottage",
    location: "Lake Tahoe, CA",
    checkIn: new Date("2023-10-05"),
    checkOut: new Date("2023-10-10"),
    status: "completed",
    totalPrice: 950,
    imageUrl: "/images/cottage.jpg",
  },
  {
    id: "3",
    propertyName: "Desert Oasis",
    location: "Joshua Tree, CA",
    checkIn: new Date("2023-09-20"),
    checkOut: new Date("2023-09-25"),
    status: "cancelled",
    totalPrice: 650,
    imageUrl: "/images/desert.jpg",
  },
];

interface Booking {
  id: string;
  propertyName: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  status: "upcoming" | "completed" | "cancelled";
  totalPrice: number;
  imageUrl: string;
}

interface BookingsListProps {
  initialBookings: Booking[];
}

export function BookingsList({ initialBookings }: BookingsListProps) {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("status") || "all";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [sortBy, setSortBy] = useState("date-desc");
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings when tab or sort changes
  useEffect(() => {
    async function fetchBookings() {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (activeTab !== "all") {
          queryParams.set("status", activeTab);
        }
        queryParams.set("sortBy", sortBy);

        const response = await fetch(`/api/bookings?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [activeTab, sortBy]);

  // Filter and sort are now handled by the API
  const sortedBookings = bookings;

  if (isLoading) {
    return <BookingsListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-md"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all" title="All bookings">
              All
            </TabsTrigger>
            <TabsTrigger value="upcoming" title="Upcoming bookings">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="completed" title="Past bookings">
              Past
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest first</SelectItem>
            <SelectItem value="date-asc">Oldest first</SelectItem>
            <SelectItem value="price-desc">Price: High to low</SelectItem>
            <SelectItem value="price-asc">Price: Low to high</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedBookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bookings found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    upcoming: "Upcoming",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <img
          src={booking.imageUrl}
          alt={booking.propertyName}
          className="object-cover w-full h-full"
        />
        <Badge
          className={`absolute top-2 right-2 ${statusColors[booking.status]}`}
        >
          {statusLabels[booking.status]}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{booking.propertyName}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" />
          {booking.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {format(new Date(booking.checkIn), "MMM d, yyyy")} -{" "}
            {format(new Date(booking.checkOut), "MMM d, yyyy")}
          </span>
        </div>
        <p className="font-medium">${booking.totalPrice} total</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        {booking.status === "upcoming" && (
          <Button variant="destructive" size="sm">
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
