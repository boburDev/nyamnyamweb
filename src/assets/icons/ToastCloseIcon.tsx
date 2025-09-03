export const ToastCloseIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M22.5 7.5L7.5 22.5"
        stroke="#2F2F2F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 7.5L22.5 22.5"
        stroke="#2F2F2F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ToastCloseIcon;
