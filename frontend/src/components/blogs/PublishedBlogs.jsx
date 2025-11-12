import { Link } from "react-router-dom";
import { extractTime } from "../../utils/extractTime";
import BlogStats from "./BlogStats";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../shared/context/auth-context";

const PublishedBlogs = ({ blog, onDelete }) => {
  const { publishedAt, title, banner, activity, blogId } = blog;

  const [showState, setShowState] = useState(false);
  const { token } = useContext(AuthContext);

  const handleShowStat = (e) => {
    e.preventDefault();
    setShowState((prev) => !prev);
  };

  const handleDeleteBlog = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/blogs/delete-blog`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogId: blogId }),
        }
      );

      const data = await response.json();
      toast.success(data.message);

      onDelete(blogId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-4 border-b border-grey transition-all duration-500 list-none">
      <Link
        className="max-lg:flex max-lg:flex-col max-lg:justify-center max-lg:gap-5"
        to={`/blog/${blogId}`}
      >
        <div className="flex justify-center gap-10">
          <div className="max-md:hidden md:block">
            <img
              src={banner}
              alt="Post Image"
              className="w-28 h-28 object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="font-inter text-xl font-medium max-md:text-xl">
              {title}
            </h1>

            <p className="text-gray-700 mt-2">{`Published on ${extractTime(
              publishedAt
            )}`}</p>

            <div className="flex items-center gap-10 mt-4">
              <Link
                to={`/editor/${blogId}`}
                className="font-inter text-xl underline text-black"
              >
                Edit
              </Link>
              <button
                onClick={handleShowStat}
                className="lg:hidden font-inter text-xl underline"
              >
                Stats
              </button>
              <button
                onClick={handleDeleteBlog}
                className="font-inter text-xl underline text-red"
              >
                Delete
              </button>
            </div>
          </div>
          <div className="max-lg:hidden">
            <BlogStats stats={activity} />
          </div>
        </div>

        {showState ? (
          <div>
            <BlogStats stats={activity} />
          </div>
        ) : (
          ""
        )}
      </Link>
    </div>
  );
};

export default PublishedBlogs;
