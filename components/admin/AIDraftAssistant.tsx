'use client';

import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { DraftPreview } from './DraftPreview';
import { LightbulbIcon, CloseIcon, SpinnerIcon } from '@/components/ui/icons';

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
        <LightbulbIcon className="w-5 h-5" />
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
                  <LightbulbIcon className="w-6 h-6 text-white" />
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
                <CloseIcon className="w-6 h-6 text-text-secondary hover:text-text-primary" />
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
                <Alert type="error" title="Error generating draft" message={error} />
              )}

              {/* Loading State */}
              {isGenerating && (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-accent-blue/20 to-accent-teal/20 border border-accent-blue/50 rounded-lg">
                    <SpinnerIcon className="h-6 w-6 text-accent-blue" />
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
                  <Alert type="success" message="Draft generated successfully!" />
                  <DraftPreview draft={generatedDraft} />
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
