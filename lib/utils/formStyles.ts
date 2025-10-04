export const inputClassName = (hasError?: boolean) =>
  `w-full px-4 py-3 bg-background-primary border ${
    hasError ? 'border-red-500' : 'border-gray-700'
  } rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue transition-colors`;

export const textareaClassName = (hasError?: boolean) =>
  `${inputClassName(hasError)} resize-none`;

export const selectClassName = (hasError?: boolean) =>
  inputClassName(hasError);
