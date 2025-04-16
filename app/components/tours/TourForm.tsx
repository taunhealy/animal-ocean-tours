"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tour } from "@/lib/types/tour";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import Textarea from "@/app/components/ui/textarea";
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

const difficultyOptions = [
  { value: "EASY", label: "Easy" },
  { value: "MODERATE", label: "Moderate" },
  { value: "CHALLENGING", label: "Challenging" },
  { value: "EXTREME", label: "Extreme" },
];

// Zod schema for form validation
const tourFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Tour name must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING", "EXTREME"]),
  duration: z.coerce
    .number()
    .int()
    .positive({ message: "Duration must be a positive number" }),
  distance: z.coerce
    .number()
    .nonnegative({ message: "Distance must be a non-negative number" }),
  startLocation: z.string().min(2, { message: "Start location is required" }),
  endLocation: z.string().min(2, { message: "End location is required" }),
  maxParticipants: z.coerce
    .number()
    .int()
    .positive({ message: "Max participants must be a positive number" }),
  basePrice: z.coerce
    .number()
    .nonnegative({ message: "Base price must be a non-negative number" }),
  published: z.boolean().optional().default(false),
});

type TourFormValues = z.infer<typeof tourFormSchema>;

interface TourFormProps {
  initialData?: Tour | null;
  onSubmit?: (tourData: Omit<Tour, "id">) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function TourForm({
  initialData,
  onSubmit,
  onSuccess,
  onCancel,
}: TourFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      duration: initialData?.duration || 1,
      distance: initialData?.distance ? Number(initialData.distance) : 0,
      startLocation: initialData?.startLocation || "",
      endLocation: initialData?.endLocation || "",
      maxParticipants: initialData?.maxParticipants || 10,
      basePrice: initialData?.basePrice ? Number(initialData.basePrice) : 0,
      published: initialData?.published ?? false,
    },
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
      // Invalidate and refetch tours query
      queryClient.invalidateQueries({ queryKey: ["tours"] });

      // Show success message
      toast.success(
        initialData ? "Tour updated successfully" : "Tour created successfully"
      );

      // Call onSuccess callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/tours");
      }
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmitForm = async (values: TourFormValues) => {
    setIsSubmitting(true);
    if (onSubmit) {
      onSubmit(values as any);
    } else {
      tourMutation.mutate(values);
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
        onSubmit={form.handleSubmit(onSubmitForm as any)}
        className="space-y-6 font-primary"
      >
        <FormField
          control={form.control as any}
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
          control={form.control as any}
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
            control={form.control as any}
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
            control={form.control as any}
            name="duration"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Duration (days)</FormLabel>
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
            control={form.control as any}
            name="distance"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Distance (km)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="input"
                    min={0}
                    step={1}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control as any}
            name="startLocation"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Start Location</FormLabel>
                <FormControl>
                  <Input {...field} className="input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="endLocation"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>End Location</FormLabel>
                <FormControl>
                  <Input {...field} className="input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control as any}
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
          control={form.control as any}
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

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button type="button" onClick={onCancel} variant="outline">
              Cancel
            </Button>
          )}
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
