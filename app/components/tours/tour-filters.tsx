"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const tourTypes = ["Seal Kayaking", "Ocean Safari", "Sardine Run"];
const difficultyLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
const durationRanges = ["1-3", "4-7", "8-14", "15+"];

export default function TourFilters({
  initialMonth = "",
  initialTourType = "",
  initialDifficulty = "",
  initialDuration = "",
  initialSearch = "",
}: {
  initialMonth?: string;
  initialTourType?: string;
  initialDifficulty?: string;
  initialDuration?: string;
  initialSearch?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const handleFilterChange = (name: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString(name, value)}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(pathname);
          }}
        >
          Reset
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["month", "tourType", "difficulty", "duration"]}
      >
        <AccordionItem value="month">
          <AccordionTrigger>Month</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {months.map((m) => (
                <div key={m} className="flex items-center space-x-2">
                  <Checkbox
                    id={`month-${m}`}
                    checked={initialMonth === m.toLowerCase()}
                    onCheckedChange={(checked) => {
                      handleFilterChange(
                        "month",
                        checked ? m.toLowerCase() : null
                      );
                    }}
                  />
                  <Label htmlFor={`month-${m}`}>{m}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tourType">
          <AccordionTrigger>Tour Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {tourTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tour-${type}`}
                    checked={initialTourType === type}
                    onCheckedChange={(checked) => {
                      handleFilterChange("tourType", checked ? type : null);
                    }}
                  />
                  <Label htmlFor={`tour-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="difficulty">
          <AccordionTrigger>Difficulty Level</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {difficultyLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${level}`}
                    checked={initialDifficulty === level}
                    onCheckedChange={(checked) => {
                      handleFilterChange("difficulty", checked ? level : null);
                    }}
                  />
                  <Label htmlFor={`difficulty-${level}`}>
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="duration">
          <AccordionTrigger>Duration (days)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {durationRanges.map((range) => (
                <div key={range} className="flex items-center space-x-2">
                  <Checkbox
                    id={`duration-${range}`}
                    checked={initialDuration === range}
                    onCheckedChange={(checked) => {
                      handleFilterChange("duration", checked ? range : null);
                    }}
                  />
                  <Label htmlFor={`duration-${range}`}>
                    {range === "15+" ? "15+ days" : `${range} days`}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
