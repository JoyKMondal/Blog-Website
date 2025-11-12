/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState, Fragment } from "react";

import AnimationWrapper from "../../shared/components/animation/page-animation";
import EditorImageUpload from "../../shared/components/FormElements/EditorImageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useContext } from "react";
import { EditorContext } from "./EditorPage";
import BlogInput from "../../shared/components/FormElements/BlogInput";
import EditorJS from "@editorjs/editorjs";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { tools } from "./tools";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const BlogEditor = () => {
  const { blog, setBlog, setEditorState } = useContext(EditorContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { error, sendRequest, clearError } = useHttpClient();
  const { token } = useContext(AuthContext);
  const blogId = useParams().blogId;

  const ejInstance = useRef();

  const { title, banner, content, tags, description } = blog;

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        ejInstance.current = editor;
      },
      placeholder: "Let's write an awesome story",
      data: Array.isArray(content) ? content[0] : content,
      onChange: async () => {
        let content = await editor.saver.save();
        setBlog((prevBlog) => ({
          ...prevBlog,
          content: content,
        }));
      },
      tools: tools,
    });
  };

  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const handlePublishEditor = () => {
    setEditorState("publish");
  };

  const handleSavingDraft = async (e) => {
    e.preventDefault();

    let blogObject = {
      title,
      banner,
      description,
      content,
      tags,
      draft: true,
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
        navigate("/dashboard/blogs?tab=draft");
      }, 500);
      console.log(responseData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!blog) {
    return null;
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="min-w-full">
        <div className="navbar">
          <div className="navbar-start">
            <Link className="btn btn-ghost text-xl capitalize">
              {blog && blog.title ? blog.title : "New Blog"}
            </Link>
          </div>
          <div className="navbar-end gap-5">
            <button
              disabled={!banner?.length || !title?.length || loading}
              onClick={handlePublishEditor}
              className="btn-dark"
              type="submit"
            >
              Publish
            </button>
            <button
              onClick={handleSavingDraft}
              className="btn-light"
              disabled={!title?.length || loading}
            >
              {loading ? "Saving draft..." : "Save draft"}
            </button>
          </div>
        </div>

        <AnimationWrapper>
          <div className="editor-section h-cover">
            <EditorImageUpload
              id="file"
              center
              onInput={inputHandler}
              errorText="Please provide an image"
            />

            <BlogInput
              id="title"
              element="textarea"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid title"
              placeholder="Blog Title"
              onInput={inputHandler}
              initialValue={blog.title}
              initialValid={true}
            />

            <div className="divider my-5"></div>

            <div id="editorjs"></div>
          </div>
        </AnimationWrapper>
      </div>
    </Fragment>
  );
};

export default BlogEditor;
