"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { TourWithRelations } from "@/lib/types/tour";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Textarea } from "@/app/components/ui/textarea";
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
import { CreateMarineLife } from "@/app/components/marine-life/create-marine-life";
import { CreateTourType } from "@/app/components/tours/create-tour-type";
import { ScheduleType } from "@prisma/client";

interface MarineLifeOption {
  value: string;
  label: string;
}

export interface MarineLifeItem {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  animalType: string;
  seasons: string[];
  expeditions: string[];
  slug: string;
  locations?: string[];
}

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

// 1. Schema for validation
const tourFormSchema = z
  .object({
    name: z.string().min(3),
    description: z.string().min(50),
    difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING", "EXTREME"]),
    duration: z.coerce.number().int().positive(),
    marineLife: z.array(z.string()),
    conservationInfo: z.string(),
    tideDependency: z.boolean(),
    maxParticipants: z.coerce.number().int().positive(),
    basePrice: z.coerce.number().nonnegative(),
    safetyBriefing: z.string(),
    images: z.array(z.string()),
    published: z.boolean(),
    guideId: z.string().nullable(),
    categoryId: z.string().nullable(),
    startLocationId: z.string().min(1),
    endLocationId: z.string().min(1),
    highlights: z.array(z.string()),
    inclusions: z.array(z.string()),
    exclusions: z.array(z.string()),
    tourTypeId: z.string(),
    scheduleType: z.nativeEnum(ScheduleType),
  })
  .strict();

type TourFormValues = z.infer<typeof tourFormSchema>;

interface TourFormProps {
  initialData?: TourWithRelations | null;
}

export default function TourForm({ initialData }: TourFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch marine life data
  const { data: marineLifeData = [] } = useQuery({
    queryKey: ["marineLife"],
    queryFn: async () => {
      const response = await fetch("/api/marine-life");
      return response.json();
    },
  });

  // Format marine life options for MultiSelect
  const marineLifeOptions: MarineLifeOption[] = Array.isArray(marineLifeData)
    ? marineLifeData.map((item: MarineLifeItem) => ({
        value: item.id,
        label: item.name,
      }))
    : [];

  // Add locations fetch
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: () => fetch("/api/locations").then((res) => res.json()),
  });

  // Add tour types query
  const { data: tourTypes = [] } = useQuery({
    queryKey: ["tourTypes"],
    queryFn: async () => {
      const response = await fetch("/api/tour-types");
      return response.json();
    },
  });

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/tours");
    }
  }, [status, router]);

  // 3. Initialize the form (simpler setup)
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      difficulty: initialData?.difficulty || "MODERATE",
      duration: initialData?.duration || 4,
      marineLife: initialData?.marineLife?.map((ml) => ml.id) || [],
      conservationInfo: initialData?.conservationInfo || "",
      tideDependency: initialData?.tideDependency || false,
      maxParticipants: initialData?.maxParticipants || 10,
      basePrice: initialData?.basePrice
        ? Number(initialData.basePrice.toString())
        : 0,
      safetyBriefing: initialData?.safetyBriefing || "",
      images: initialData?.images || [],
      published: initialData?.published || false,
      guideId: initialData?.guideId || null,
      categoryId: initialData?.categoryId || null,
      startLocationId: initialData?.startLocationId || "",
      endLocationId: initialData?.endLocationId || "",
      highlights: initialData?.highlights || [],
      inclusions: initialData?.inclusions || [],
      exclusions: initialData?.exclusions || [],
      tourTypeId: initialData?.tourTypeId || "",
      scheduleType: initialData?.scheduleType || "HOURLY",
    },
  });

  // Mutation for creating/updating tour
  const tourMutation = useMutation({
    mutationFn: async (values: TourFormValues) => {
      console.log("Calling API with values:", values); // Debug log

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

      const data = await response.json();
      console.log("API response:", data); // Debug log
      return data;
    },
    onSuccess: () => {
      console.log("Mutation successful"); // Debug log
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      toast.success(
        initialData ? "Tour updated successfully" : "Tour created successfully"
      );
      router.push("/dashboard/admin/tours");
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error); // Debug log
      toast.error(`Error: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmitForm = async (values: TourFormValues) => {
    console.log("Form submitted with values:", values); // Debug log
    setIsSubmitting(true);
    try {
      tourMutation.mutate(values);
    } catch (error) {
      console.error("Submit error:", error); // Debug log
      setIsSubmitting(false);
      toast.error("Failed to submit form");
    }
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
        onSubmit={form.handleSubmit((data) => {
          console.log("Form submitting...", data); // Debug log
          onSubmitForm(data);
        })}
        className="space-y-6 font-primary"
      >
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Tour Name</FormLabel>
              <Input {...field} className="input" />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Description</FormLabel>
              <Textarea {...field} className="input" rows={4} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="difficulty"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
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
            name="scheduleType"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Schedule Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOURLY">Hourly (Same-day)</SelectItem>
                    <SelectItem value="MULTIDAY">Multi-day Tour</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Duration (
                {form.watch("scheduleType") === "HOURLY" ? "hours" : "days"})
              </FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="marineLife"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marine Species</FormLabel>
              <div className="flex gap-2">
                <MultiSelect
                  options={marineLifeOptions}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select marine species..."
                />
                <CreateMarineLife
                  onSuccess={(newMarineLife) => {
                    // Refetch marine life data after creation
                    queryClient.invalidateQueries({ queryKey: ["marineLife"] });
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="basePrice"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Base Price ($)</FormLabel>
                <Input
                  type="number"
                  {...field}
                  className="input"
                  min={0}
                  step={0.01}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="maxParticipants"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Max Participants</FormLabel>
                <Input type="number" {...field} className="input" min={1} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="safetyBriefing"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Safety Briefing</FormLabel>
              <Textarea {...field} className="input" rows={4} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <div className="space-y-1 leading-none">
                <FormLabel>Publish Tour</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          name="startLocationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Location</FormLabel>
              <LocationSelect
                selected={field.value}
                onChange={field.onChange}
                locations={locations}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="endLocationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Arrival Location</FormLabel>
              <LocationSelect
                selected={field.value}
                onChange={field.onChange}
                locations={locations}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="tourTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tour Type</FormLabel>
              <div className="flex gap-2">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a tour type" />
                  </SelectTrigger>
                  <SelectContent>
                    {tourTypes.map((type: { id: string; name: string }) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <CreateTourType />
              </div>
              <FormMessage />
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
          <Button
            type="submit"
            variant="tertiary"
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting
              ? "Submitting..."
              : initialData
                ? "Update Tour"
                : "Create Tour"}
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
