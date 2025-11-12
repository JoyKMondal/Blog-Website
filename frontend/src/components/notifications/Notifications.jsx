import { Link } from "react-router-dom";
import { extractTime } from "../../utils/extractTime";

const Notifications = ({ notification }) => {
  const { type, createdAt } = notification;

  let blogId, seen, title, fullName, username, profileImage, mainComment;

  if (type === "like") {
    ({
      blog: { blogId, title },
      seen,
      user: {
        personal_info: { fullName, username, profileImage },
      },
    } = notification);
  } else if (type === "comment") {
    ({
      blog: { blogId, title },
      seen,
      user: {
        personal_info: { fullName, username, profileImage },
      },
      comment: { comment: mainComment },
    } = notification);
  } else if (type === "reply") {
    ({
      blog: { blogId, title },
      seen,
      user: {
        personal_info: { fullName, username, profileImage },
      },
      replied_on_comment: { comment: mainComment },
    } = notification);
  }

  return (
    <div
      className={`p-4 ${
        !seen && "font-bold"
      } bg-white hover:bg-grey border-b border-grey transition-all duration-500 list-none`}
    >
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
                <Link to={`/user/${username}`}>
                  <span className="text-gray-500">{username}</span>
                </Link>
                <span className="ml-2">
                  {type === "like"
                    ? "liked your blog"
                    : type === "comment"
                    ? "commented on"
                    : "replied on"}
                </span>
              </div>
            </div>

            {type === "reply" ? (
              <h1 className="bg-grey hover:bg-white p-3 mt-2 font-inter text-2xl max-md:text-xl">
                &ldquo;{mainComment}&rdquo;
              </h1>
            ) : (
              <h1 className="mt-2 font-inter text-2xl max-md:text-xl">
                &ldquo;{title}&rdquo;
              </h1>
            )}

            {type !== "like" ? (
              <p className="text-gray-700 text-xl my-4">{mainComment}</p>
            ) : (
              ""
            )}

            <p className="text-gray-700 mt-2">{extractTime(createdAt)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Notifications;
