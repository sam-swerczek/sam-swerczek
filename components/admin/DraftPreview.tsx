'use client';

interface DraftPreviewProps {
  draft: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
    metaDescription: string;
  };
}

interface PreviewFieldProps {
  label: string;
  children: React.ReactNode;
}

function PreviewField({ label, children }: PreviewFieldProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-text-secondary mb-1">{label}</h3>
      {children}
    </div>
  );
}

export function DraftPreview({ draft }: DraftPreviewProps) {
  return (
    <div className="space-y-4 p-4 bg-background-primary border border-gray-700 rounded-lg max-h-96 overflow-y-auto">
      <PreviewField label="Title">
        <p className="text-lg font-semibold text-text-primary">{draft.title}</p>
      </PreviewField>

      <PreviewField label="Slug">
        <p className="text-sm text-accent-blue font-mono">{draft.slug}</p>
      </PreviewField>

      <PreviewField label="Excerpt">
        <p className="text-sm text-text-primary">{draft.excerpt}</p>
      </PreviewField>

      <PreviewField label="Tags">
        <div className="flex flex-wrap gap-2">
          {draft.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-accent-blue/20 text-accent-blue text-xs rounded-md border border-accent-blue/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </PreviewField>

      <PreviewField label="Content Preview">
        <div className="text-sm text-text-primary bg-background-secondary p-3 rounded border border-gray-700 max-h-48 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans">{draft.content.slice(0, 500)}...</pre>
        </div>
      </PreviewField>
    </div>
  );
}
