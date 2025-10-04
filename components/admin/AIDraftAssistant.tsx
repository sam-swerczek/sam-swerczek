'use client';

import { useState } from 'react';

interface GeneratedDraft {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  metaDescription: string;
}

interface AIDraftAssistantProps {
  onUseDraft: (draft: GeneratedDraft) => void;
}

export default function AIDraftAssistant({ onUseDraft }: AIDraftAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedDraft | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a topic or prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedDraft(null);

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate draft');
      }

      const draft = await response.json();
      setGeneratedDraft(draft);
    } catch (err) {
      console.error('Error generating draft:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate draft');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseDraft = () => {
    if (generatedDraft) {
      onUseDraft(generatedDraft);
      setIsOpen(false);
      setPrompt('');
      setGeneratedDraft(null);
      setError(null);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setPrompt('');
    setGeneratedDraft(null);
    setError(null);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-teal hover:from-accent-teal hover:to-accent-blue text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        AI Draft Assistant
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-background-secondary border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-accent-blue/10 to-accent-teal/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-accent-blue to-accent-teal rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">AI Draft Assistant</h2>
                  <p className="text-sm text-text-secondary">Powered by Claude</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-background-primary rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-text-secondary hover:text-text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Prompt Input */}
              {!generatedDraft && (
                <div>
                  <label htmlFor="ai-prompt" className="block text-sm font-medium text-text-primary mb-2">
                    What would you like to write about?
                  </label>
                  <textarea
                    id="ai-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-background-primary border border-gray-700 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
                    placeholder="Example: TypeScript best practices for React hooks, Building a serverless API with AWS Lambda, My journey learning Rust..."
                    disabled={isGenerating}
                  />
                  <p className="mt-2 text-sm text-text-secondary">
                    Be specific about your topic. The more detail you provide, the better the generated content will be.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                  <div className="flex items-start gap-2 text-red-400">
                    <svg
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-medium">Error generating draft</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isGenerating && (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-accent-blue/20 to-accent-teal/20 border border-accent-blue/50 rounded-lg">
                    <svg
                      className="animate-spin h-6 w-6 text-accent-blue"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-lg font-medium text-text-primary">
                      Generating your draft with Claude...
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-text-secondary">This may take 10-20 seconds</p>
                </div>
              )}

              {/* Generated Draft Preview */}
              {generatedDraft && !isGenerating && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <p className="font-medium">Draft generated successfully!</p>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-background-primary border border-gray-700 rounded-lg max-h-96 overflow-y-auto">
                    <div>
                      <h3 className="text-sm font-medium text-text-secondary mb-1">Title</h3>
                      <p className="text-lg font-semibold text-text-primary">{generatedDraft.title}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-text-secondary mb-1">Slug</h3>
                      <p className="text-sm text-accent-blue font-mono">{generatedDraft.slug}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-text-secondary mb-1">Excerpt</h3>
                      <p className="text-sm text-text-primary">{generatedDraft.excerpt}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-text-secondary mb-1">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {generatedDraft.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-accent-blue/20 text-accent-blue text-xs rounded-md border border-accent-blue/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-text-secondary mb-1">Content Preview</h3>
                      <div className="text-sm text-text-primary bg-background-secondary p-3 rounded border border-gray-700 max-h-48 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans">{generatedDraft.content.slice(0, 500)}...</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 p-6 border-t border-gray-700 bg-background-primary">
              {!generatedDraft ? (
                <>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-primary hover:bg-background-primary transition-colors"
                    disabled={isGenerating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-accent-blue to-accent-teal hover:from-accent-teal hover:to-accent-blue text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Draft'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setGeneratedDraft(null);
                      setError(null);
                    }}
                    className="px-6 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-primary hover:bg-background-primary transition-colors"
                  >
                    Generate Another
                  </button>
                  <button
                    onClick={handleUseDraft}
                    className="px-6 py-2 bg-gradient-to-r from-accent-blue to-accent-teal hover:from-accent-teal hover:to-accent-blue text-white rounded-lg font-semibold transition-all"
                  >
                    Use This Draft
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
