"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // Layout
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",

        // Navigation
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),

        // Grid
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",

        // Day cell (the <td>)
        day: "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20",

        // Day button (the <button> inside the td)
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal",
        ),

        // ── Range styling ──────────────────────────────────────────────
        // The td for range start: strip bg, rounded left, solid primary button
        range_start: [
          "bg-muted rounded-l-md",
          "[&>button]:bg-primary [&>button]:text-primary-foreground",
          "[&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
          "[&>button]:rounded-md",
        ].join(" "),

        // The td for range end: strip bg, rounded right, solid primary button
        range_end: [
          "bg-muted rounded-r-md",
          "[&>button]:bg-primary [&>button]:text-primary-foreground",
          "[&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
          "[&>button]:rounded-md",
        ].join(" "),

        // The td for days in the middle: strip bg only, transparent button
        range_middle: [
          "bg-muted rounded-none",
          "[&>button]:!bg-transparent [&>button]:!text-foreground",
          "[&>button]:rounded-none",
        ].join(" "),

        // Single-day selection (no range)
        selected: [
          "[&>button]:bg-primary [&>button]:text-primary-foreground",
          "[&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
          "[&>button]:rounded-md",
        ].join(" "),
        // ───────────────────────────────────────────────────────────────

        today: "[&>button]:bg-accent [&>button]:text-accent-foreground",
        outside:
          "opacity-30 [&>button]:text-muted-foreground aria-selected:[&>button]:text-muted-foreground",
        disabled: "opacity-30 [&>button]:text-muted-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
