import { useState, useEffect } from "react";

const SearchUserSkeleton = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!showSkeleton) {
    return null;
  }

  return (
    <div className="my-5 mx-auto">
      <div className="flex flex-col gap-10">
        <div className="skeleton h-16 w-72"></div>
      </div>
    </div>
  );
};

export default SearchUserSkeleton;
