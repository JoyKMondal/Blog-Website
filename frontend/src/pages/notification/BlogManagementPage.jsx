/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import NoDataFound from "../../components/skeletons/NoDataFound";
import AnimationWrapper from "../../shared/components/animation/page-animation";
import InPageNavigation from "../home/InPageNavigation";
import { useHttpClient } from "../../shared/hooks/http-hook";
import BlogSkeleton from "../../components/skeletons/BlogSkeleton";
import PublishedBlogs from "../../components/blogs/PublishedBlogs";
import DraftBlogs from "../../components/blogs/DraftBlogs";
import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useSearchParams } from "react-router-dom";

const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState(null);
  const [draftBlogs, setDraftBlogs] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { sendRequest } = useHttpClient();
  const { token } = useContext(AuthContext);
  const activeTab = useSearchParams()[0].get("tab");

  const fetchBlogs = async ({ draft }) => {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/blogs/all-blogs`,
        "POST",
        JSON.stringify({
          draft,
          searchQuery,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      if (!draft) {
        setBlogs(responseData.blogs);
      } else {
        setDraftBlogs(responseData.blogs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      if (blogs === null) {
        fetchBlogs({ draft: false });
      }

      if (draftBlogs === null) {
        fetchBlogs({ draft: true });
      }
    }
  }, [token, searchQuery]);

  const handleSearchEvent = (e) => {
    const value = e.target.value;

    setSearchQuery(value);
    if (e.keyCode === 13 && value.length) {
      setBlogs(null);
      setDraftBlogs(null);
    }
  };

  const handleChange = (e) => {
    if (!e.target.value.length) {
      setSearchQuery("");
      setBlogs(null);
      setDraftBlogs(null);
    }
  };

  const handleBlogDelete = (deletedBlogId) => {
    setBlogs((prevBlogs) =>
      prevBlogs.filter((blog) => blog.blogId !== deletedBlogId)
    );
  };

  return (
    <div className="w-full mx-auto px-10">
      <h1 className="max-md:hidden my-4 text-xl font-inter font-semibold">
        Manage Blogs
      </h1>
      <div className="mb-4 flex gap-5">
        <label className="input bg-grey rounded-3xl flex items-center gap-2 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            onChange={handleChange}
            onKeyDown={handleSearchEvent}
            className="grow"
            placeholder="Search Blogs"
          />
        </label>
      </div>

      <div className="py-4">
        <InPageNavigation
          routes={["Published Blogs", "Drafts"]}
          defaultActiveIndex={activeTab !== "draft" ? 0 : 1}
        >
          <div>
            {blogs === null ? (
              [...Array(4)].map((_, idx) => <BlogSkeleton key={idx} />)
            ) : blogs.length ? (
              blogs.map((blog, index) => {
                return (
                  <AnimationWrapper
                    key={blog.blogId}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  >
                    <PublishedBlogs blog={blog} onDelete={handleBlogDelete} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataFound message="No blogs found" />
            )}
          </div>

          <div>
            {draftBlogs === null ? (
              [...Array(3)].map((_, idx) => <BlogSkeleton key={idx} />)
            ) : draftBlogs.length ? (
              draftBlogs.map((blog, index) => (
                <AnimationWrapper
                  key={blog.blogId}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  <DraftBlogs
                    blog={blog}
                    index={index}
                    onDelete={handleBlogDelete}
                  />
                </AnimationWrapper>
              ))
            ) : (
              <NoDataFound message="No trending blogs found" />
            )}
          </div>
        </InPageNavigation>
      </div>
    </div>
  );
};

export default BlogManagementPage;
