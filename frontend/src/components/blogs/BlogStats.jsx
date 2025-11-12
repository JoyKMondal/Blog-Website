const BlogStats = ({ stats }) => {
  return (
    <div className="flex gap-10 items-center py-4">
      {Object.keys(stats).map((key, i) => {
        return !key.includes("parent") ? (
          <div key={i} className="text-center flex flex-col gap-5">
            <p className="text-xl font-bold">{stats[key].toLocaleString()}</p>
            <p className="text-xl">{key.split("_")[1]}</p>
          </div>
        ) : (
          ""
        );
      })}
    </div>
  );
};

export default BlogStats;
