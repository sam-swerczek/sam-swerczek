/**
 * Centralized content configuration for homepage sections
 * This file contains all hardcoded content for Discovery, Values, and Activity sections
 */

export const skillIndicators = [
  {
    label: 'Performance',
    icon: 'music' as const,
    color: 'accent-blue',
    category: 'music' as const,
  },
  {
    label: 'Songwriting',
    icon: 'music' as const,
    color: 'accent-blue',
    category: 'music' as const,
  },
  {
    label: 'Music Production',
    icon: 'music' as const,
    color: 'accent-blue',
    category: 'music' as const,
  },
  {
    label: 'Web Development',
    icon: 'code' as const,
    color: 'accent-teal',
    category: 'engineering' as const,
  },
  {
    label: 'Application Development',
    icon: 'code' as const,
    color: 'accent-teal',
    category: 'engineering' as const,
  },
  {
    label: 'System Design',
    icon: 'code' as const,
    color: 'accent-teal',
    category: 'engineering' as const,
  },
] as const;

export const coreValues = [
  {
    id: 'collaborative',
    icon: 'lightbulb',
    title: 'Collaborative',
    description: 'Great work emerges from diverse perspectives. I thrive in cross-functional teams where musicians collaborate with engineers and designers challenge developers.',
    accentColor: 'accent-blue',
  },
  {
    id: 'iterative',
    icon: 'code',
    title: 'Iterative',
    description: 'First drafts are never final—whether it\'s a song demo or a code commit. I believe in rapid prototyping, gathering feedback, and refining until excellence emerges.',
    accentColor: 'accent-teal',
  },
  {
    id: 'user-centered',
    icon: 'star',
    title: 'User-Centered',
    description: 'Every song should move someone; every feature should solve a real problem. I start with empathy and end with impact, whether the audience is concert-goers or end-users.',
    accentColor: 'accent-gold',
  },
] as const;

// Type exports for TypeScript inference
export type SkillIndicator = typeof skillIndicators[number];
export type CoreValue = typeof coreValues[number];
export type IconType = 'music' | 'code' | 'lightbulb' | 'star';
