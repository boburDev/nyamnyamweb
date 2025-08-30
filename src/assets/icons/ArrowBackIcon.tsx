export const ArrowBackIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
      <path
        d="M15.9998 6.66668L6.6665 16L15.9998 25.3333"
        stroke="#2F2F2F"
        strokeWidth="1.64103"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.3332 16L6.6665 16"
        stroke="#2F2F2F"
        strokeWidth="1.64103"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowBackIcon;
