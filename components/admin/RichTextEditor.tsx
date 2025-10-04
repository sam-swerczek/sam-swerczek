'use client';

import { useState } from 'react';
import { marked } from 'marked';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const renderPreview = () => {
    return { __html: marked(value, { breaks: true, gfm: true }) as string };
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-background-secondary border-b border-gray-700 p-2 flex items-center gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => insertMarkdown('# ', '')}
          className="px-3 py-1 rounded hover:bg-background-primary transition-colors text-sm"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('## ', '')}
          className="px-3 py-1 rounded hover:bg-background-primary transition-colors text-sm"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('### ', '')}
          className="px-3 py-1 rounded hover:bg-background-primary transition-colors text-sm"
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <button
          type="button"
          onClick={() => insertMarkdown('**', '**')}
          className="px-3 py-1 rounded hover:bg-background-primary transition-colors font-bold text-sm"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('*', '*')}
          className="px-3 py-1 rounded hover:bg-background-primary transition-colors italic text-sm"
          title="Italic"
        >
          I
        </button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <button
          type="button"
          onClick={() => insertMarkdown('[', '](url)')}
          className="px-3 py-1 rounded hover:bg-background-primary transition-colors text-sm"
          title="Link"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('`', '`')}
          className="px-3 py-1 rounded hover:bg-background-primary transition-colors font-mono text-sm"
          title="Code"
        >
          {'</>'}
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('```\n', '\n```')}
          className="px-3 py-1 rounded hover:bg-background-primary transition-colors text-sm"
          title="Code Block"
        >
          Code Block
        </button>
        <div className="w-px h-6 bg-gray-700 mx-1" />
        <button
          type="button"
          onClick={() => insertMarkdown('- ', '')}
          className="px-3 py-1 rounded hover:bg-background-primary transition-colors text-sm"
          title="List"
        >
          List
        </button>

        {/* Tab switcher */}
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              activeTab === 'write' ? 'bg-accent-blue text-white' : 'hover:bg-background-primary'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              activeTab === 'preview' ? 'bg-accent-blue text-white' : 'hover:bg-background-primary'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="min-h-[400px]">
        {activeTab === 'write' ? (
          <textarea
            id="content-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Write your content here... (Markdown supported)'}
            className="w-full min-h-[400px] p-4 bg-transparent text-text-primary resize-y focus:outline-none font-mono text-sm"
          />
        ) : (
          <div
            className="p-4 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={renderPreview()}
          />
        )}
      </div>

      {/* Helper text */}
      <div className="bg-background-secondary border-t border-gray-700 px-4 py-2 text-xs text-text-secondary">
        Markdown supported: **bold**, *italic*, [link](url), `code`, ```code block```, # heading
      </div>
    </div>
  );
}
