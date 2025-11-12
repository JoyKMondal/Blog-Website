import { useContext, useEffect, useState } from "react";
import { BlogDetailContext } from "../../pages/blog/BlogDetailPage";
import { AuthContext } from "../../shared/context/auth-context";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useHttpClient } from "../../shared/hooks/http-hook";

const BlogQuality = () => {
  let {
    blog: {
      _id,
      title,
      blogId,
      activity: { total_likes, total_comments },
      creator: {
        personal_info: { username },
      },
    },
    setBlog,
  } = useContext(BlogDetailContext);

  const [liked, setLiked] = useState(false);
  const { sendRequest } = useHttpClient();

  const navigate = useNavigate();
  const { loggedInUser, isLoggedIn, token } = useContext(AuthContext);

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

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      return navigate("/login");
    }

    try {
      const response = await sendRequest(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/blogs/toggle-like-blog`,
        "POST",
        JSON.stringify({ _id: _id }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );

      setBlog((prevBlog) => ({
        ...prevBlog,
        activity: {
          ...prevBlog.activity,
          total_likes: response.blog.activity.total_likes,
        },
      }));
      setLiked(response.likedByUser);
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  return (
    <div>
      <hr className="border-grey my-2" />
      <div className="flex justify-between items-center">
        <div className="flex gap-10 items-center">
          <div className="flex gap-3 items-center">
            <button
              className={`h-12 w-12 rounded-full flex items-center justify-center bg-grey ${
                liked ? "text-red" : ""
              }`}
              onClick={handleLikeClick}
              style={{ cursor: "pointer" }}
            >
              <i
                className={`fi text-2xl ${
                  liked ? "fi-sr-heart" : "fi-rr-heart"
                }`}
              ></i>
            </button>
            <p className="text-dark-grey text-xl">{total_likes}</p>
          </div>

          <div className="drawer-content flex gap-3 items-center">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button h-12 w-12 rounded-full flex items-center justify-center bg-grey cursor-pointer"
            >
              <i className="fi fi-rs-comment-dots text-2xl"></i>
            </label>
            <p className="text-dark-grey text-xl">{total_comments}</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {loggedInUser.personal_info.username === username && (
            <Link
              className="text-xl underline text-black hover:text-purple transition-colors duration-300"
              to={`/editor/${blogId}`}
            >
              Edit
            </Link>
          )}

          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-black text-2xl hover:text-twitter transition-colors duration-300"></i>
          </Link>
        </div>
      </div>
      <hr className="border-grey my-2" />
    </div>
  );
};

export default BlogQuality;
