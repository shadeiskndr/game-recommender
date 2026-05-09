"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export function GameDescription({ description }: { description: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // Determine if description is long enough to need collapsing
  const isLongDescription = description.length > 300;
  const shortDescription = isLongDescription
    ? description.slice(0, 300) + "..."
    : description;

  if (!isLongDescription) {
    return (
      <p className="text-foreground leading-relaxed text-lg">{description}</p>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-4">
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed text-lg">
            {isOpen ? description : shortDescription}
          </p>
        </div>

        <CollapsibleTrigger className="flex items-center space-x-2 text-primary hover:text-primary transition-colors text-sm font-medium group cursor-pointer">
          <span>{isOpen ? "Show Less" : "Show More"}</span>
          {isOpen ? (
            <ChevronUpIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
          )}
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  );
}
