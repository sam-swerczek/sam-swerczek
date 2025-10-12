interface MenuIconProps {
  isOpen: boolean;
  className?: string;
}

/**
 * Animated hamburger menu icon that transforms to an X when open
 * - 3 horizontal lines that rotate and translate to form an X
 * - 250ms transition with ease-in-out easing
 * - Respects prefers-reduced-motion
 */
export default function MenuIcon({ isOpen, className = "" }: MenuIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Top line - rotates 45deg and moves down when open */}
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={`origin-center transition-all duration-250 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-[6px]' : 'rotate-0 translate-y-0'
        }`}
        style={{
          transformOrigin: '12px 6px',
        }}
      />

      {/* Middle line - fades out when open */}
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={`transition-all duration-250 ease-in-out ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Bottom line - rotates -45deg and moves up when open */}
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={`origin-center transition-all duration-250 ease-in-out ${
          isOpen ? '-rotate-45 -translate-y-[6px]' : 'rotate-0 translate-y-0'
        }`}
        style={{
          transformOrigin: '12px 18px',
        }}
      />
    </svg>
  );
}
