import { Fragment, useContext, useState } from "react";
import { EditorContext } from "./EditorPage";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import PublishInput from "../../shared/components/FormElements/PublishInput";
import Tag from "./Tag";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const PublishEditor = () => {
  const { blog, setBlog, setEditorState } = useContext(EditorContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { sendRequest, clearError, error } = useHttpClient();
  const { token } = useContext(AuthContext);

  const { title, banner, content, description } = blog;

  let tagLimit = 10;

  const blogId = useParams().blogId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      file: {
        value: null,
        isValid: false,
      },
      title: {
        value: "",
        isValid: false,
      },
      topic: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const tags = blog?.tags || [];

  const handletagKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      let tag = e.target.value;

      if (tags?.length < tagLimit) {
        if (!tags.includes(tag) && tag?.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        alert(`You can add upto ${tagLimit} tags.`);
      }
    }
  };

  const handlePublish = async (event) => {
    event.preventDefault();

    let blogObject = {
      title,
      banner,
      description,
      content,
      tags,
      draft: false,
    };

    try {
      setLoading(true);
      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/blogs/create-blog`,
        "POST",
        JSON.stringify({ ...blogObject, id: blogId }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      setTimeout(() => {
        navigate("/dashboard/blogs");
      }, 500);
      console.log(responseData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <section className="w-screen section-min-height overflow-scroll grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <button
          onClick={() => setEditorState("editor")}
          className="btn btn-square absolute top-5 left-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col justify-center">
          <p className="my-5 font-semibold opacity-75">Preview</p>
          <div className="w-full h-[16rem] flex justify-center items-center text-center mb-5 border-r-[50%] bg-grey">
            {blog.banner && (
              <img
                className="w-[100%] h-[100%] object-cover"
                src={blog.banner}
                alt="Preview"
              />
            )}
          </div>
          <div className="flex flex-col justify-center gap-5">
            {blog.title && <p className="text-5xl font-bold">{blog.title}</p>}
            {blog.description && <p>{blog.description}</p>}
          </div>

          <p className="text-dark-grey mb-2 mt-9">
            Helps in searching and ranking your blog post
          </p>
          <div className="relative input-box pl-2 py-2 pb-4">
            <PublishInput
              element="input"
              id="topic"
              type="text"
              placeholder="Topic"
              onKeyDown={handletagKeyDown}
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a topic"
              onInput={inputHandler}
              initialValue={blog.topic}
              initialValid={true}
            />

            {tags?.map((tag, index) => {
              return <Tag tag={tag} tagIndex={index} key={index} />;
            })}
          </div>

          {blog.tags && (
            <p className="mt-2 text-dark-grey text-right">
              {tagLimit - tags?.length} tags left
            </p>
          )}
        </div>

        <div className="gap-5">
          <PublishInput
            element="input"
            id="title"
            type="text"
            label="Blog Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter your blog title"
            onInput={inputHandler}
            initialValue={blog.title}
            initialValid={true}
          />

          <PublishInput
            id="description"
            element="textarea"
            label="Short description about your blog"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a description"
            onInput={inputHandler}
            initialValue={blog.description}
            initialValid={true}
          />

          <button
            disabled={
              loading || !title?.length || !description?.length || !tags?.length
            }
            onClick={handlePublish}
            className="btn-dark"
          >
            {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </section>
    </Fragment>
  );
};

export default PublishEditor;
