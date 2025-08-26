export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x={1} y={1} width={14} height={14} rx={3} fill="#4FB477" />
      <rect
        x={1}
        y={1}
        width={14}
        height={14}
        rx={3}
        stroke="#4FB477"
        strokeWidth={2}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.7394 5.25098C12.0869 5.58571 12.0869 6.12831 11.7394 6.46305L7.28876 10.749C6.94116 11.0837 6.37771 11.0837 6.03012 10.749L4.24987 9.03463C3.91254 8.69829 3.91736 8.16365 4.26071 7.833C4.60406 7.50235 5.15924 7.49771 5.50851 7.82256L6.65944 8.93091L10.4807 5.25098C10.8283 4.91634 11.3918 4.91634 11.7394 5.25098Z"
        fill="white"
      />
    </svg>
  );
};

export default CheckIcon;
