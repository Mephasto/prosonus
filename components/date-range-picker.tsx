"use client";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className = "",
  date,
  setDate,
}: {
  className?: string;
  date: DateRange | undefined;
  setDate: (range: DateRange | undefined) => void;
}) {
  const handleFromSelect = (day: Date | undefined) => {
    setDate({
      from: day,
      // si la nueva fecha de inicio es posterior al fin actual, borramos el fin
      to: date?.to && day && day > date.to ? undefined : date?.to,
    });
  };

  const handleToSelect = (day: Date | undefined) => {
    setDate({ from: date?.from, to: day });
  };

  const handleClear = () => setDate(undefined);

  return (
    <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
      {/* ── Fecha inicio ── */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !date?.from && "text-muted-foreground/60",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="flex flex-col items-start">
              <span className="text-[10px] text-muted-foreground leading-none mb-0.5">
                Inicio
              </span>
              {date?.from ? format(date.from, "dd/MM/yyyy") : "—"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="single"
            selected={date?.from}
            onSelect={handleFromSelect}
            defaultMonth={date?.from}
          />
        </PopoverContent>
      </Popover>

      {/* ── Fecha fin ── */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !date?.to && "text-muted-foreground/60",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="flex flex-col items-start">
              <span className="text-[10px] text-muted-foreground leading-none mb-0.5">
                Fin
              </span>
              {date?.to ? format(date.to, "dd/MM/yyyy") : "—"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="single"
            selected={date?.to}
            disabled={date?.from ? { before: date.from } : undefined}
            defaultMonth={date?.from ?? date?.to}
            onSelect={handleToSelect}
          />
        </PopoverContent>
      </Popover>

      {/* ── Borrar ── */}
      {(date?.from || date?.to) && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground self-center"
          onClick={handleClear}
          aria-label="Borrar fechas"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
