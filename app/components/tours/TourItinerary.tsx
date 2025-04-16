"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  distance?: number;
  meals?: string[];
  accommodation?: string;
}

interface TourItineraryProps {
  itinerary: ItineraryDay[];
}

export default function TourItinerary({ itinerary }: TourItineraryProps) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Tour Itinerary
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {itinerary.map((day, index) => (
          <AccordionItem key={index} value={`day-${day.day}`}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center text-left">
                <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  {day.day}
                </div>
                <span className="font-medium">{day.title}</span>
                {day.distance && (
                  <span className="ml-auto text-sm text-gray-500 mr-4">
                    {day.distance} km
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pl-11">
                <p className="text-gray-700 mb-3">{day.description}</p>

                {day.meals && day.meals.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="font-medium mr-2">Meals:</span>
                    <span>{day.meals.join(", ")}</span>
                  </div>
                )}

                {day.accommodation && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">Accommodation:</span>
                    <span>{day.accommodation}</span>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
