import { useState, useEffect } from "react";

const BlogSkeleton = () => {
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
        <div className="skeleton h-32 w-96"></div>
      </div>
      <div className="max-md:hidden skeleton w-32 h-32 rounded-full shrink-0"></div>
    </div>
  );
};

export default BlogSkeleton;
