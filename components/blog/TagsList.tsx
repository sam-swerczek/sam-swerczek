interface TagsListProps {
  tags: string[];
  className?: string;
}

export default function TagsList({ tags, className = '' }: TagsListProps) {
  if (!tags || tags.length === 0) {
    return null;
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
