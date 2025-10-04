"use client";

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
}

export default function TagFilter({ tags, selectedTag, onTagChange }: TagFilterProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
        Filter by Topic
      </h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onTagChange(null)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            selectedTag === null
              ? "bg-accent-blue text-white"
              : "bg-background-secondary text-text-secondary hover:text-text-primary hover:bg-background-secondary/80"
          }`}
        >
          All Posts
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
              selectedTag === tag
                ? "bg-accent-blue text-white"
                : "bg-background-secondary text-text-secondary hover:text-text-primary hover:bg-background-secondary/80"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {selectedTag && (
        <p className="text-sm text-text-secondary">
          Showing posts tagged with <span className="text-accent-blue font-medium">{selectedTag}</span>
        </p>
      )}
    </div>
  );
}
