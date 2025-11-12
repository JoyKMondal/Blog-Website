import { Link } from "react-router-dom";

const EditorNav = ({ blog }) => {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <Link className="btn btn-ghost text-xl capitalize">
          {blog && blog.title ? blog.title : "New Blog"}
        </Link>
      </div>
      <div className="navbar-end gap-5">
        <button className="btn-dark">Publish</button>
        <button className="btn-light btn-ghost">Save draft</button>
      </div>
    </div>
  );
};

export default EditorNav;
