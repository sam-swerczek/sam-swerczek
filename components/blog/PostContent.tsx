interface PostContentProps {
  content: string;
  className?: string;
}

export default function PostContent({ content, className = '' }: PostContentProps) {
  // Format the content with proper line breaks and styling
  // This is a simple implementation - in production, you'd use a markdown renderer
  const formatContent = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      // Skip empty paragraphs
      if (paragraph.trim() === '') return null;

      // Handle headings
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl md:text-3xl font-bold text-text-primary mt-12 mb-4 first:mt-0">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }

      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl md:text-2xl font-bold text-text-primary mt-8 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }

      // Handle code blocks
      if (paragraph.startsWith('```')) {
        // This is a simple approach - in production, use a proper markdown parser
        return null; // Will handle code blocks separately
      }

      // Handle list items
      if (paragraph.startsWith('- ')) {
        return (
          <li key={index} className="text-text-secondary leading-relaxed ml-6 mb-2">
            {paragraph.replace('- ', '')}
          </li>
        );
      }

      // Handle bold text (simple regex replacement)
      const formattedParagraph = paragraph
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
        .replace(/`(.+?)`/g, '<code class="px-2 py-1 bg-background-secondary text-accent-teal rounded text-sm font-mono">$1</code>');

      // Regular paragraph
      return (
        <p
          key={index}
          className="text-text-secondary leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: formattedParagraph }}
        />
      );
    });
  };

  // Extract and render code blocks separately
  const renderCodeBlocks = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]+?)```/g;
    const parts: React.JSX.Element[] = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add content before code block
      if (match.index > lastIndex) {
        const beforeContent = text.slice(lastIndex, match.index);
        parts.push(
          <div key={`text-${keyIndex++}`}>
            {formatContent(beforeContent)}
          </div>
        );
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2].trim();

      parts.push(
        <div key={`code-${keyIndex++}`} className="my-8">
          <div className="bg-background-primary rounded-lg overflow-hidden border border-gray-800">
            <div className="px-4 py-2 bg-background-secondary border-b border-gray-800 text-xs text-text-secondary font-mono">
              {language}
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm font-mono text-accent-teal leading-relaxed">
                {code}
              </code>
            </pre>
          </div>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining content
    if (lastIndex < text.length) {
      const remainingContent = text.slice(lastIndex);
      parts.push(
        <div key={`text-${keyIndex++}`}>
          {formatContent(remainingContent)}
        </div>
      );
    }

    return parts.length > 0 ? parts : formatContent(text);
  };

  return (
    <article className={`prose prose-invert max-w-none ${className}`}>
      <div className="text-base md:text-lg">
        {renderCodeBlocks(content)}
      </div>
    </article>
  );
}
