"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DateRange {
  from: number;
  to: number;
}

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

type PresetKey = "7d" | "30d" | "90d" | "all";

const presets: { key: PresetKey; label: string }[] = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "all", label: "All time" },
];

function getPresetRange(key: PresetKey): DateRange | undefined {
  if (key === "all") return undefined;

  const now = Date.now();
  const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
  const from = now - days * 24 * 60 * 60 * 1000;

  return { from, to: now };
}

function getActivePreset(range: DateRange | undefined): PresetKey {
  if (!range) return "all";

  const now = Date.now();
  const days = Math.round((now - range.from) / (24 * 60 * 60 * 1000));

  if (days <= 8) return "7d";
  if (days <= 31) return "30d";
  if (days <= 91) return "90d";
  return "all";
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activePreset = getActivePreset(value);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <CalendarDays className="h-4 w-4" />
        {presets.find((p) => p.key === activePreset)?.label ?? "Select range"}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border bg-popover p-1 shadow-lg">
            {presets.map((preset) => (
              <button
                key={preset.key}
                onClick={() => {
                  onChange(getPresetRange(preset.key));
                  setIsOpen(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                  activePreset === preset.key
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
