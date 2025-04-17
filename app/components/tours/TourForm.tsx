"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tour } from "@/lib/types/tour";
import { MarineLifeItem } from "@/lib/types/marine-life";
import { getMarineLifeData } from "@/lib/data/marine-life";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Textarea } from "@/app/components/ui/textarea";
import { LOcationSelect } from "@/app/components/ui/location-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";
import { MultiSelect } from "@/app/components/ui/multi-select";
import { LocationSelect } from "@/app/components/ui/location-select";

const difficultyOptions = [
  { value: "EASY", label: "Easy" },
  { value: "MODERATE", label: "Moderate" },
  { value: "CHALLENGING", label: "Challenging" },
  { value: "EXTREME", label: "Extreme" },
];

const seasonOptions = [
  { value: "summer", label: "Summer" },
  { value: "autumn", label: "Autumn" },
  { value: "winter", label: "Winter" },
  { value: "spring", label: "Spring" },
];

// Zod schema for form validation
const tourFormSchema = z.object({
  name: z.string().min(3, "Tour name must be at least 3 characters"),
  description: z.string().min(50, "Description required"),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING", "EXTREME"]),
  duration: z.coerce.number().int().positive(),
  marineLifeIds: z.array(z.string()).min(1, "Select marine species"),
  conservationInfo: z.string().min(20),
  tideDependency: z.boolean().default(false),
  departurePort: z.string().min(2),
  marineArea: z.string().min(2),
  seasons: z.array(z.string()).min(1),
  expeditionType: z.string().min(2),
  maxParticipants: z.coerce.number().int().positive(),
  basePrice: z.coerce.number().nonnegative(),
  requiredEquipment: z.array(z.string()).default([]),
  safetyBriefing: z.string().optional(),
  images: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  guideId: z.string().optional(),
  categoryId: z.string().optional(),
  startLocationId: z.string().min(1, "Required"),
  endLocationId: z.string().min(1, "Required"),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

interface TourFormProps {
  initialData?: Tour | null;
}

export default function TourForm({ initialData }: TourFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch marine life data
  const { data: marineLifeData = [] } = useQuery({
    queryKey: ["marineLife"],
    queryFn: () => getMarineLifeData(),
  });

  // Create marine life options for MultiSelect
  const marineLifeOptions = marineLifeData.map((item: MarineLifeItem) => ({
    value: item.id,
    label: item.name,
  }));

  // Get unique expedition types from marine life data
  const expeditionOptions = Array.from(
    new Set(marineLifeData.flatMap((item: MarineLifeItem) => item.expeditions))
  ).map((expedition) => ({
    value: expedition,
    label: expedition,
  }));

  // Add locations fetch
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: () => fetch("/api/locations").then((res) => res.json()),
  });

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/tours");
    }
  }, [status, router]);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      difficulty: initialData?.difficulty || "MODERATE",
      duration: initialData?.duration || 4,
      marineLifeIds: initialData?.marineLifeIds || [],
      tideDependency: initialData?.tideDependency ?? false,
      marineArea: initialData?.marineArea || "",
      seasons: initialData?.seasons || [],
      expeditionType: initialData?.expeditionType || "",
      maxParticipants: initialData?.maxParticipants || 10,
      basePrice: initialData?.basePrice ? Number(initialData.basePrice) : 0,
      requiredEquipment: initialData?.requiredEquipment || [],
      safetyBriefing: initialData?.safetyBriefing || "",
      images: initialData?.images || [],
      published: initialData?.published ?? false,
      guideId: initialData?.guideId || "",
      categoryId: initialData?.categoryId || "",
      startLocationId: initialData?.startLocationId || "",
      endLocationId: initialData?.endLocationId || "",
    } as TourFormValues,
  });

  // Mutation for creating/updating tour
  const tourMutation = useMutation({
    mutationFn: async (values: TourFormValues) => {
      const url = initialData ? `/api/tours/${initialData.id}` : "/api/tours";
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save tour");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast.success(
        initialData ? "Tour updated successfully" : "Tour created successfully"
      );
      router.push("/dashboard/admin/tours");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmitForm = async (values: TourFormValues) => {
    setIsSubmitting(true);
    tourMutation.mutate(values);
  };

  // If loading authentication, show loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center p-8 font-primary">Loading...</div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="space-y-6 font-primary"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Tour Name</FormLabel>
              <FormControl>
                <Input {...field} className="input" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="input" rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Duration (hours)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="input" min={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="marineLifeIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marine Species</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={marineLifeOptions}
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expeditionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expedition Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOAT">Boat Expedition</SelectItem>
                    <SelectItem value="SNORKEL">Snorkeling</SelectItem>
                    <SelectItem value="DIVING">Scuba Diving</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="seasons"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Seasons</FormLabel>
              <MultiSelect
                options={seasonOptions}
                selected={field.value}
                onChange={field.onChange}
                placeholder="Select seasons..."
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departurePort"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Departure Port</FormLabel>
                <FormControl>
                  <Input {...field} className="input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marineArea"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Marine Area</FormLabel>
                <FormControl>
                  <Input {...field} className="input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Base Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="input"
                    min={0}
                    step={0.01}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxParticipants"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Max Participants</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="input" min={1} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="safetyBriefing"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Safety Briefing</FormLabel>
              <FormControl>
                <Textarea {...field} className="input" rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publish Tour</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startLocationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Location</FormLabel>
              <LocationSelect
                selected={field.value}
                onChange={field.onChange}
                locations={locations}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={() => router.push("/dashboard/admin/tours")}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit" variant="tertiary" disabled={isSubmitting}>
            {initialData ? "Update Tour" : "Create Tour"}
            {isSubmitting && (
              <span className="ml-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
