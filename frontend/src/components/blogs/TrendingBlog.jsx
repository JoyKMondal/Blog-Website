import { Link } from "react-router-dom";
import { extractTime } from "../../utils/extractTime";

const TrendingBlog = ({ blog, index }) => {
  const {
    title,
    blogId,
    creator: {
      personal_info: { fullName, username, profileImage },
    },
    publishedAt,
  } = blog;

  const formattedTime = extractTime(publishedAt);

  return (
    <div className="p-4 bg-white hover:bg-grey border-b border-grey transition-all duration-500 list-none">
      <Link
        className="flex items-center gap-5"
        to={`/blog/${blogId}`}
      >
        <h1 className="text-neutral-300 rounded-full text-4xl font-bold">
          0{index + 1}
        </h1>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <img
              src={profileImage}
              alt="Profile Image"
              className="w-6 h-6 rounded-full"
            />
            <span>{fullName}</span>
            <span className="text-gray-500">{username}</span>
            <span className="text-gray-500">{formattedTime}</span>
          </div>
          <div className="mt-1 font-semibold">
            <p>{title}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TrendingBlog;
