export const ProfileFavourite = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.0312 6.875V17.0312H2.96875V6.875"
        stroke="#2F2F2F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.40625 2.96875H18.5938V6.875H1.40625V2.96875Z"
        stroke="#2F2F2F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.4375 10H11.5625"
        stroke="#2F2F2F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ProfileFavourite;
