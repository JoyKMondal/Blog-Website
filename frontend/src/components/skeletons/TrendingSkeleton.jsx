const TrendingSkeleton = () => {
  return (
    <div className="flex gap-10 items-center my-8 mx-auto">
      <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
      <div className="flex flex-col gap-10">
        <div className="skeleton h-16 w-96"></div>
      </div>
    </div>
  );
};
export default TrendingSkeleton;
