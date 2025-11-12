import { Link } from "react-router-dom";
import { extractTime } from "../../utils/extractTime";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import axios from "axios";

const Blog = ({ blog, author }) => {
  const { fullName, username, profileImage } = author;
  const {
    publishedAt,
    _id,
    tags,
    title,
    description,
    banner,
    activity: { total_likes, total_comments },
    blogId,
  } = blog;

  const [liked, setLiked] = useState(false);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_URL
          }/api/blogs/is-liked/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLiked(response.data.likedByUser);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    if (_id) checkIfLiked();
  }, [_id, token]);

  const formattedTime = extractTime(publishedAt);

  return (
    <div className="p-4 bg-white hover:bg-grey border-b border-grey transition-all duration-500 list-none">
      <Link to={`/blog/${blogId}`}>
        <div className="flex items-start justify-center">
          <Link to={`/user/${username}`}>
            <img
              src={profileImage}
              alt="Profile Image"
              className="w-12 h-12 rounded-full mr-4"
            />
          </Link>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <span className="mr-4">{fullName}</span>
                <span className="text-gray-500">
                  {username} - {formattedTime}
                </span>
              </div>
            </div>

            <h1 className="mt-2 font-inter text-2xl font-medium max-md:text-xl">
              {title}
            </h1>

            <p className="text-gray-700 mt-2">{description}</p>

            <div className="flex items-center mt-4 gap-5">
              <span className="text-gray-500">{tags[0]}</span>
              <span
                className={`ml-4 text-gray-500 flex items-center gap-2 ${
                  liked ? "text-red" : ""
                }`}
              >
                <i
                  className={`fi text-2xl ${
                    liked ? "fi-sr-heart" : "fi-rr-heart"
                  }`}
                ></i>
                <span>{total_likes}</span>
              </span>

              <span className="ml-4 text-gray-500 flex items-center gap-2">
                <i className="fi fi-rs-comment-dots text-2xl"></i>
                <span>{total_comments}</span>
              </span>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src={banner}
              alt="Post Image"
              className="w-32 h-32 object-cover"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Blog;
