"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/app/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = e.target as HTMLInputElement;
    if (e.key === "Delete" || e.key === "Backspace") {
      if (input.value === "" && selected.length > 0) {
        onChange(selected.slice(0, -1));
      }
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectables = options.filter(
    (option) => !selected.includes(option.value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          type="button"
          className={`flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${className}`}
        >
          <div className="flex flex-wrap gap-1">
            {selected.map((item) => (
              <Badge key={item} variant="secondary" className="font-primary">
                {options.find((option) => option.value === item)?.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <CommandPrimitive.Input
              placeholder={selected.length === 0 ? placeholder : ""}
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="font-primary">
          <CommandGroup className="max-h-64 overflow-auto">
            {selectables.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No options available
              </p>
            )}
            {selectables.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange([...selected, option.value]);
                  setInputValue("");
                }}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
