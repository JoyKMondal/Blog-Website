import { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import toast from "react-hot-toast";

const DraftBlogs = ({ blog, index, onDelete }) => {
  const { title, description, blogId } = blog;
  const { token } = useContext(AuthContext);

  const showDeletePopup = (e) => {
    e.preventDefault();
    document.getElementById("my_modal_1").showModal();
  };

  const deleteBlog = async (blogId) => {
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

  const handleDeleteBlog = (blogId) => {
    deleteBlog(blogId);
  };

  return (
    <Fragment>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold font-inter text-lg">Are you sure?</h3>
          <p className="py-4 font-inter text-xl">
            Press Delete to remove the blog and press cancel to close the popup
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn-dark"
                onClick={() => handleDeleteBlog(blogId)}
              >
                Delete
              </button>
              <button className="btn-grey ml-4">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="p-4 border-b border-grey transition-all duration-500 list-none">
        <Link className="flex items-center gap-10" to={`/blog/${blogId}`}>
          <h1 className="text-neutral-300 rounded-full text-5xl font-bold">
            0{index + 1}
          </h1>
          <div className="flex flex-col justify-center">
            <div className="flex flex-col justify-center gap-2">
              <p className="font-inter font-semibold text-xl">{title}</p>
              <span className="text-gray-500">
                {description ? description : "No description"}
              </span>
            </div>
            <div className="flex items-center gap-10 mt-4">
              <Link
                to={`/editor/${blogId}`}
                className="font-inter text-xl underline text-black"
              >
                Edit
              </Link>
              <button
                className="font-inter text-xl underline text-red"
                type="button"
                onClick={showDeletePopup}
              >
                Delete
              </button>
            </div>
          </div>
        </Link>
      </div>
    </Fragment>
  );
};

export default DraftBlogs;
