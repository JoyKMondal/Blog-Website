const NoDataFound = ({ message }) => {
  return (
    <div className="h-48 p-4 w-full flex flex-col justify-center items-center bg-grey">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="stroke-info h-16 w-16 shrink-0"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <div className="flex flex-col justify-center items-center">
        <h3 className="font-bold text-2xl py-5">Sorry!</h3>
        <div className="text-xs">{message}</div>
      </div>
    </div>
  );
};

export default NoDataFound;
