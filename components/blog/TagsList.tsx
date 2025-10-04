interface TagsListProps {
  tags: string[];
  className?: string;
  compact?: boolean;
}

export default function TagsList({ tags, className = '', compact = false }: TagsListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-1.5 ${className}`}>
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] font-medium text-accent-blue/80 border border-accent-blue/20 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 text-xs font-medium bg-background-primary text-accent-blue border border-accent-blue/30 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
