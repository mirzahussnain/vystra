const Logo=({ className = "w-8 h-8" }: { className?: string }) =>{
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 4V20L20 12L6 4Z"
        className="fill-primary"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 12H23"
        className="stroke-primary/50"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 16L21 19"
        className="stroke-primary/40"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 8L21 5"
        className="stroke-primary/60"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Logo;