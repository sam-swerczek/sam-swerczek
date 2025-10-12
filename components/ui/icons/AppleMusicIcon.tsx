interface IconProps {
  className?: string;
}

export function AppleMusicIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M23.995 12c0 6.617-5.377 12-11.995 12S.005 18.617.005 12 5.382 0 12 0s11.995 5.383 11.995 12zm-5.463-5.314l-5.5 1.832a1.5 1.5 0 0 0-1.032 1.425v7.31a2.788 2.788 0 0 0-1.5-.439c-1.657 0-3 1.119-3 2.5s1.343 2.5 3 2.5 3-1.119 3-2.5V9.732l4.5-1.5v5.021a2.788 2.788 0 0 0-1.5-.439c-1.657 0-3 1.119-3 2.5s1.343 2.5 3 2.5 3-1.119 3-2.5v-8.128z"/>
    </svg>
  );
}
