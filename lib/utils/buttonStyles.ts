export const buttonVariants = {
  primary: "px-6 py-2 bg-accent-blue hover:bg-accent-teal text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "px-6 py-2 bg-background-secondary border border-gray-700 rounded-lg text-text-primary hover:bg-background-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  danger: "px-6 py-2 bg-red-900/30 border border-red-700 text-red-400 rounded-lg font-semibold hover:bg-red-900/50 transition-colors disabled:opacity-50",
  filter: "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
  icon: "p-2 rounded-lg hover:bg-background-secondary transition-colors",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export const getButtonClasses = (
  variant: ButtonVariant,
  isActive?: boolean,
  additionalClasses?: string
) => {
  const base = buttonVariants[variant];

  if (variant === 'filter') {
    const activeClasses = isActive
      ? 'bg-accent-blue text-white'
      : 'bg-background-primary text-text-secondary hover:text-text-primary border border-gray-700';
    return `${base} ${activeClasses} ${additionalClasses || ''}`.trim();
  }

  return `${base} ${additionalClasses || ''}`.trim();
};
