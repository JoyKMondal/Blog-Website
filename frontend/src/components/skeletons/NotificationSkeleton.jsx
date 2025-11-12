import { useState, useEffect } from "react";

const NotificationSkeleton = () => {
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
    <div className="flex gap-10 items-center my-8 mx-auto">
      <div className="flex flex-col gap-10">
        <div className="skeleton h-28 w-96"></div>
      </div>
    </div>
  );
};

export default NotificationSkeleton;
