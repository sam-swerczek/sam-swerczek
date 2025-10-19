'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import RichTextEditor from './RichTextEditor';
import { generateSlug } from '@/lib/utils/slugify';
import { FormField } from '@/components/ui/FormField';
import { inputClassName, textareaClassName } from '@/lib/utils/formStyles';

interface PostFormProps {
  post?: Post;
  onSubmit: (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading?: boolean;
  initialData?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    tags?: string[];
    metaDescription?: string;
  };
}

export default function PostForm({ post, onSubmit, isLoading = false, initialData }: PostFormProps) {
  const [shortTitle, setShortTitle] = useState(post?.short_title || '');
  const [title, setTitle] = useState(post?.title || initialData?.title || '');
  const [slug, setSlug] = useState(post?.slug || initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || initialData?.excerpt || '');
  const [content, setContent] = useState(post?.content || initialData?.content || '');
  const [tags, setTags] = useState(post?.tags?.join(', ') || initialData?.tags?.join(', ') || '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featured_image_url || '');
  const [metaDescription, setMetaDescription] = useState(post?.meta_description || initialData?.metaDescription || '');
  const [published, setPublished] = useState(post?.published || false);
  const [autoSlug, setAutoSlug] = useState(!post);
  const [autoShortTitle, setAutoShortTitle] = useState(!post?.short_title);

  // Update form when initialData changes (from AI draft)
  useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.slug) setSlug(initialData.slug);
      if (initialData.excerpt) setExcerpt(initialData.excerpt);
      if (initialData.content) setContent(initialData.content);
      if (initialData.tags) setTags(initialData.tags.join(', '));
      if (initialData.metaDescription) setMetaDescription(initialData.metaDescription);
    }
  }, [initialData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (autoSlug && title) {
      setSlug(generateSlug(title));
    }
  }, [title, autoSlug]);

  // Auto-generate short title from title (truncate to 30 chars)
  useEffect(() => {
    if (autoShortTitle && title) {
      const truncated = title.length > 30 ? title.substring(0, 27) + '...' : title;
      setShortTitle(truncated);
    }
  }, [title, autoShortTitle]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!metaDescription.trim()) {
      newErrors.metaDescription = 'Meta description is required for SEO';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, shouldPublish: boolean) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const postData: Omit<Post, 'id' | 'created_at' | 'updated_at'> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags: tagsArray,
      featured_image_url: featuredImageUrl.trim() || null,
      meta_description: metaDescription.trim(),
      published: shouldPublish,
      published_at: shouldPublish ? new Date().toISOString() : null,
      author_id: post?.author_id || '', // Will be set by parent component
      short_title: shortTitle.trim() || null,
      type: post?.type || 'blog post', // Default type
    };

    await onSubmit(postData);
  };

  return (
    <form className="space-y-6">
      {/* Short Title */}
      <FormField
        id="shortTitle"
        label="Short Title"
        helperText="2-4 word title for activity timeline (auto-generated from title)"
      >
        <div className="flex items-start gap-2">
          <input
            type="text"
            id="shortTitle"
            value={shortTitle}
            onChange={(e) => {
              setShortTitle(e.target.value);
              setAutoShortTitle(false);
            }}
            maxLength={50}
            className={inputClassName()}
            placeholder="Brief title"
          />
          <button
            type="button"
            onClick={() => {
              setAutoShortTitle(true);
              const truncated = title.length > 30 ? title.substring(0, 27) + '...' : title;
              setShortTitle(truncated);
            }}
            className="px-4 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
          >
            Auto-generate
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          {shortTitle.length}/50 characters
        </p>
      </FormField>

      {/* Title */}
      <FormField id="title" label="Title" required error={errors.title}>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClassName(!!errors.title)}
          placeholder="Enter post title"
        />
      </FormField>

      {/* Slug */}
      <FormField
        id="slug"
        label="Slug"
        required
        error={errors.slug}
        helperText="URL-friendly version of the title"
      >
        <div className="flex items-start gap-2">
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setAutoSlug(false);
            }}
            className={inputClassName(!!errors.slug)}
            placeholder="my-blog-post"
          />
          <button
            type="button"
            onClick={() => {
              setAutoSlug(true);
              setSlug(generateSlug(title));
            }}
            className="px-4 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
          >
            Auto-generate
          </button>
        </div>
      </FormField>

      {/* Excerpt */}
      <FormField
        id="excerpt"
        label="Excerpt"
        required
        error={errors.excerpt}
        helperText="Brief summary shown on listing pages"
      >
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className={textareaClassName(!!errors.excerpt)}
          placeholder="A brief description of your post..."
        />
      </FormField>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-text-primary mb-2">
          Content *
        </label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Write your post content here..."
        />
        {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
      </div>

      {/* Tags */}
      <FormField
        id="tags"
        label="Tags"
        helperText='Comma-separated, e.g., "engineering, typescript, react"'
      >
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClassName()}
          placeholder="engineering, typescript, react"
        />
      </FormField>

      {/* Featured Image URL */}
      <FormField
        id="featuredImage"
        label="Featured Image URL"
        helperText="optional"
      >
        <input
          type="url"
          id="featuredImage"
          value={featuredImageUrl}
          onChange={(e) => setFeaturedImageUrl(e.target.value)}
          className={inputClassName()}
          placeholder="https://example.com/image.jpg"
        />
      </FormField>

      {/* Meta Description */}
      <FormField
        id="metaDescription"
        label="Meta Description (SEO)"
        required
        error={errors.metaDescription}
        helperText="150-160 characters recommended"
      >
        <textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={2}
          maxLength={160}
          className={textareaClassName(!!errors.metaDescription)}
          placeholder="This description will appear in search engine results..."
        />
        <p className="text-xs text-text-secondary mt-1">
          {metaDescription.length}/160 characters
        </p>
      </FormField>

      {/* Published Checkbox */}
      <div className="flex items-center gap-3 p-4 bg-background-secondary rounded-lg border border-gray-700">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-5 h-5 rounded border-gray-700 bg-background-primary text-accent-blue focus:ring-2 focus:ring-accent-blue"
        />
        <label htmlFor="published" className="text-sm font-medium text-text-primary">
          Published
          <span className="ml-2 text-text-secondary font-normal">
            (Uncheck to save as draft)
          </span>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={isLoading}
          className="px-6 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-primary hover:bg-background-primary transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isLoading}
          className="px-6 py-2 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Publishing...' : 'Publish'}
        </button>

        {post && (
          <div className="ml-auto text-sm text-text-secondary">
            <p>Created: {new Date(post.created_at).toLocaleDateString()}</p>
            <p>Updated: {new Date(post.updated_at).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </form>
  );
}
