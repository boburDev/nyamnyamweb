export const LanguageIcon = (props: React.SVGProps<SVGSVGElement>) => {
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
        d="M15 27.5C21.9036 27.5 27.5 21.9036 27.5 15C27.5 8.09644 21.9036 2.5 15 2.5C8.09644 2.5 2.5 8.09644 2.5 15C2.5 21.9036 8.09644 27.5 15 27.5Z"
        stroke="#2F2F2F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 2.5C11.7903 5.87019 10 10.3459 10 15C10 19.6541 11.7903 24.1298 15 27.5C18.2097 24.1298 20 19.6541 20 15C20 10.3459 18.2097 5.87019 15 2.5Z"
        stroke="#2F2F2F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 15H27.5"
        stroke="#2F2F2F"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LanguageIcon;
