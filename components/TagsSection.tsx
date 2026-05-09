"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export function TagsSection({ tags }: { tags: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const tagArray = tags.split(", ");
  const visibleTags = tagArray.slice(0, 8);
  const hiddenTags = tagArray.slice(8);

  if (tagArray.length <= 8) {
    return (
      <div className="flex flex-wrap gap-2">
        {tagArray.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-primary/15 text-primary rounded-lg text-sm border border-primary/25 hover:bg-primary/25 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {visibleTags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-primary/15 text-primary rounded-lg text-sm border border-primary/25 hover:bg-primary/25 transition-colors"
            >
              {tag}
            </span>
          ))}

          {/* Show hidden tags inline when expanded */}
          {isOpen &&
            hiddenTags.map((tag, index) => (
              <span
                key={index + 8}
                className="px-3 py-1.5 bg-primary/15 text-primary rounded-lg text-sm border border-primary/25 hover:bg-primary/25 transition-colors"
              >
                {tag}
              </span>
            ))}
        </div>

        <CollapsibleTrigger className="flex items-center space-x-2 text-primary hover:text-primary transition-colors text-sm font-medium group cursor-pointer">
          <span>
            {isOpen ? "Show Less" : `Show ${hiddenTags.length} More Tags`}
          </span>
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
