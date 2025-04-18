"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateMarineLifeProps {
  onSuccess: (marineLife: { id: string; name: string }) => void;
}

interface MarineLifeInput {
  name: string;
  description: string;
  image: string;
  activeMonths: number[];
}

export function CreateMarineLife({ onSuccess }: CreateMarineLifeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [marineLife, setMarineLife] = useState<MarineLifeInput>({
    name: "",
    description: "",
    image: "",
    activeMonths: [],
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: MarineLifeInput) => {
      const response = await fetch("/api/marine-life", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create marine life");
      return response.json();
    },
    onSuccess: (newMarineLife) => {
      queryClient.invalidateQueries({ queryKey: ["marineLife"] });
      toast.success("Marine life created successfully");
      onSuccess(newMarineLife);
      setIsOpen(false);
      setMarineLife({
        name: "",
        description: "",
        image: "",
        activeMonths: [],
      });
    },
    onError: () => {
      toast.error("Failed to create marine life");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Marine Life</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={marineLife.name}
              onChange={(e) =>
                setMarineLife({ ...marineLife, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={marineLife.description}
              onChange={(e) =>
                setMarineLife({ ...marineLife, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Image URL</label>
            <Input
              value={marineLife.image}
              onChange={(e) =>
                setMarineLife({ ...marineLife, image: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">Active Months (1-12)</label>
            <Input
              placeholder="e.g., 1,2,3,4"
              value={marineLife.activeMonths.join(",")}
              onChange={(e) => {
                const months = e.target.value
                  .split(",")
                  .map(Number)
                  .filter((n) => n >= 1 && n <= 12);
                setMarineLife({ ...marineLife, activeMonths: months });
              }}
            />
          </div>

          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => mutate(marineLife)}
          >
            Create Marine Life
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
