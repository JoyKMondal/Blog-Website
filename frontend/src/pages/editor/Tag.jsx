/* eslint-disable no-const-assign */
import { useContext } from "react";
import { EditorContext } from "./EditorPage";

const Tag = ({ tag, tagIndex }) => {
  const { blog, setBlog, setEditorState } = useContext(EditorContext);
  let { tags } = blog;

  const handleTagdelete = () => {
    tags = tags.filter((t) => t !== tag);
    console.log(tags)
    setBlog({ ...blog, tags });
  };

  const handleTag = (e) => {
    e.target.setAttribute("contentEditable", true);
    e.target.focus();
  };

  const handleTagEdit = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      let currentTag = e.target.innerText;
      tags[tagIndex] = currentTag;
      setBlog({ ...blog, tags });

      e.target.setAttribute("contentEditable", false);
    }
  };

  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-5 w-5 stroke-current font-bold cursor-pointer"
          onClick={handleTagdelete}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
        <span
          onClick={handleTag}
          onKeyDown={handleTagEdit}
          className="outline-none"
          contentEditable="true"
        >
          {tag}
        </span>
      </div>
    </div>
  );
};

export default Tag;
