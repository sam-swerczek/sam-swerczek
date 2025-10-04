"use client";

import { useState } from "react";

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
}

export default function TagFilter({ tags, selectedTag, onTagChange }: TagFilterProps) {
  const [showAll, setShowAll] = useState(false);

  if (!tags || tags.length === 0) {
    return null;
  }

  // Show top 5 tags by default, or all if showAll is true
  const topTags = tags.slice(0, 5);
  const remainingTags = tags.slice(5);
  const displayTags = showAll ? tags : topTags;
  const hasMore = remainingTags.length > 0;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagChange(null)}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
          selectedTag === null
            ? "bg-accent-blue text-white"
            : "bg-background-secondary text-text-secondary hover:text-text-primary hover:bg-background-secondary/80 border border-gray-700/50"
        }`}
      >
        All
      </button>
      {displayTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
            selectedTag === tag
              ? "bg-accent-blue text-white"
              : "bg-background-secondary text-text-secondary hover:text-text-primary hover:bg-background-secondary/80 border border-gray-700/50"
          }`}
        >
          {tag}
        </button>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 bg-background-secondary text-text-secondary hover:text-accent-blue hover:bg-background-secondary/80 border border-gray-700/50"
          title={showAll ? "Show less" : `Show ${remainingTags.length} more`}
        >
          {showAll ? "Less" : "..."}
        </button>
      )}
    </div>
  );
}
