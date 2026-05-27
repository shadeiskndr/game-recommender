"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  GENRES,
  PLATFORMS,
  RATING_OPTIONS,
  SORT_OPTIONS,
  YEARS,
} from "@/lib/facets";
import { countActiveFilters, type SearchFilters } from "@/lib/searchParams";

function SearchFilters({ filters }: { filters: SearchFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const activeCount = countActiveFilters(filters);

  // Rewrites the URL after applying `mutate`, always resetting pagination so a
  // filter/sort change starts from the first page.
  function navigate(mutate: (p: URLSearchParams) => void) {
    const p = new URLSearchParams(searchParams.toString());
    mutate(p);
    p.delete("limit");
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleMulti(key: "genres" | "platforms", value: string) {
    navigate((p) => {
      const current = p.getAll(key);
      p.delete(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      next.forEach((v) => p.append(key, v));
    });
  }

  function setSingle(key: string, value: string) {
    navigate((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });
  }

  function clearAll() {
    navigate((p) => {
      ["genres", "platforms", "minRating", "yearFrom", "yearTo"].forEach((k) =>
        p.delete(k),
      );
    });
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-8">
      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
            {open ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>

          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <XMarkIcon className="h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>

        {/* Sort */}
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Sort by</span>
          <NativeSelect
            value={filters.sort}
            onChange={(e) => setSingle("sort", e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <NativeSelectOption key={o.value} value={o.value}>
                {o.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </label>
      </div>

      {/* Expandable Panel */}
      {open && (
        <div className="mt-6 space-y-6 border-t border-border pt-6">
          {/* Genres */}
          <FacetChips
            label="Genres"
            options={GENRES}
            selected={filters.genres}
            onToggle={(v) => toggleMulti("genres", v)}
          />

          {/* Platforms */}
          <FacetChips
            label="Platforms"
            options={PLATFORMS}
            selected={filters.platforms}
            onToggle={(v) => toggleMulti("platforms", v)}
          />

          {/* Rating + Years */}
          <div className="flex flex-wrap gap-6">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Min rating</span>
              <NativeSelect
                value={filters.minRating?.toString() ?? ""}
                onChange={(e) => setSingle("minRating", e.target.value)}
              >
                {RATING_OPTIONS.map((o) => (
                  <NativeSelectOption key={o.value} value={o.value}>
                    {o.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Released from</span>
              <NativeSelect
                value={filters.yearFrom?.toString() ?? ""}
                onChange={(e) => setSingle("yearFrom", e.target.value)}
              >
                <NativeSelectOption value="">Any year</NativeSelectOption>
                {YEARS.map((y) => (
                  <NativeSelectOption key={y} value={y.toString()}>
                    {y}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Released to</span>
              <NativeSelect
                value={filters.yearTo?.toString() ?? ""}
                onChange={(e) => setSingle("yearTo", e.target.value)}
              >
                <NativeSelectOption value="">Any year</NativeSelectOption>
                {YEARS.map((y) => (
                  <NativeSelectOption key={y} value={y.toString()}>
                    {y}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

function FacetChips({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              aria-pressed={isSelected}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/30 text-muted-foreground border-muted-foreground/40 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SearchFilters;
