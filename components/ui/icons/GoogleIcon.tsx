interface IconProps {
  className?: string;
}

// Google "G" logo in its official brand colors. Uses fixed fills (not
// currentColor) intentionally, per Google's branding guidelines.
export function GoogleIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M23.52 12.273c0-.851-.076-1.67-.218-2.455H12v4.642h6.458a5.52 5.52 0 0 1-2.394 3.622v3.01h3.878c2.269-2.09 3.578-5.166 3.578-8.819z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.956-1.075 7.942-2.908l-3.878-3.01c-1.075.72-2.45 1.145-4.064 1.145-3.125 0-5.77-2.11-6.714-4.946H1.276v3.11A11.997 11.997 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.286 14.281A7.215 7.215 0 0 1 4.91 12c0-.79.136-1.559.376-2.281v-3.11H1.276A11.997 11.997 0 0 0 0 12c0 1.936.464 3.769 1.276 5.391l4.01-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.773c1.762 0 3.344.606 4.59 1.794l3.44-3.44C17.951 1.19 15.235 0 12 0A11.997 11.997 0 0 0 1.276 6.609l4.01 3.11C6.23 6.883 8.875 4.773 12 4.773z"
      />
    </svg>
  );
}
