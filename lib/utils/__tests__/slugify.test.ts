import { generateSlug, isValidSlug, sanitizeTags } from '../slugify';

describe('slugify utilities', () => {
  describe('generateSlug', () => {
    it('converts title to lowercase', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('replaces spaces with hyphens', () => {
      expect(generateSlug('My Blog Post Title')).toBe('my-blog-post-title');
    });

    it('removes special characters', () => {
      expect(generateSlug('Hello! World?')).toBe('hello-world');
    });

    it('handles multiple consecutive spaces', () => {
      expect(generateSlug('Hello    World')).toBe('hello-world');
    });

    it('removes leading and trailing hyphens', () => {
      expect(generateSlug('!Hello World!')).toBe('hello-world');
    });

    it('handles mixed alphanumeric content', () => {
      expect(generateSlug('10 Tips for 2024')).toBe('10-tips-for-2024');
    });

    it('handles empty strings', () => {
      expect(generateSlug('')).toBe('');
    });

    it('handles strings with only special characters', () => {
      expect(generateSlug('!!!')).toBe('');
    });

    it('handles strings with underscores and dashes', () => {
      expect(generateSlug('hello_world-test')).toBe('hello-world-test');
    });

    it('removes apostrophes and quotes', () => {
      expect(generateSlug("It's a \"Test\"")).toBe('it-s-a-test');
    });
  });

  describe('isValidSlug', () => {
    it('returns true for valid slugs', () => {
      expect(isValidSlug('hello-world')).toBe(true);
      expect(isValidSlug('blog-post-123')).toBe(true);
      expect(isValidSlug('test')).toBe(true);
    });

    it('returns false for slugs with uppercase', () => {
      expect(isValidSlug('Hello-World')).toBe(false);
    });

    it('returns false for slugs with spaces', () => {
      expect(isValidSlug('hello world')).toBe(false);
    });

    it('returns false for slugs with special characters', () => {
      expect(isValidSlug('hello@world')).toBe(false);
      expect(isValidSlug('hello_world')).toBe(false);
    });

    it('returns false for slugs with leading hyphens', () => {
      expect(isValidSlug('-hello')).toBe(false);
    });

    it('returns false for slugs with trailing hyphens', () => {
      expect(isValidSlug('hello-')).toBe(false);
    });

    it('returns false for slugs with consecutive hyphens', () => {
      expect(isValidSlug('hello--world')).toBe(false);
    });

    it('returns false for empty strings', () => {
      expect(isValidSlug('')).toBe(false);
    });

    it('returns true for slugs with numbers', () => {
      expect(isValidSlug('2024-update')).toBe(true);
    });
  });

  describe('sanitizeTags', () => {
    it('converts tags to lowercase', () => {
      expect(sanitizeTags(['JavaScript', 'REACT'])).toEqual(['javascript', 'react']);
    });

    it('trims whitespace from tags', () => {
      expect(sanitizeTags([' javascript ', '  react  '])).toEqual(['javascript', 'react']);
    });

    it('removes empty tags', () => {
      expect(sanitizeTags(['javascript', '', 'react', '   '])).toEqual(['javascript', 'react']);
    });

    it('removes duplicate tags', () => {
      expect(sanitizeTags(['javascript', 'react', 'javascript'])).toEqual(['javascript', 'react']);
    });

    it('removes duplicates after normalization', () => {
      expect(sanitizeTags(['JavaScript', 'JAVASCRIPT', 'javascript'])).toEqual(['javascript']);
    });

    it('handles empty array', () => {
      expect(sanitizeTags([])).toEqual([]);
    });

    it('handles array with only empty strings', () => {
      expect(sanitizeTags(['', '  ', ''])).toEqual([]);
    });

    it('preserves tag order (first occurrence)', () => {
      expect(sanitizeTags(['react', 'javascript', 'typescript'])).toEqual([
        'react',
        'javascript',
        'typescript',
      ]);
    });

    it('handles complex whitespace', () => {
      expect(sanitizeTags([' \t JavaScript \n ', 'React'])).toEqual(['javascript', 'react']);
    });
  });
});
