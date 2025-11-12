/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { extractTime } from "../../utils/extractTime";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import AnimationWrapper from "../../shared/components/animation/page-animation";
import BlogQuality from "../../components/blogs/BlogQuality";
import Blog from "../../components/blogs/Blog";
import SearchUserSkeleton from "../../components/skeletons/SearchUserSkeleton";
import NoDataFound from "../../components/skeletons/NoDataFound";
import { BlogContent } from "../../components/blogs/BlogContent";
import CommentDrawer, {
  fetchComments,
} from "../../components/comments/CommentDrawer";

export const blogObject = {
  title: "",
  description: "",
  content: [],
  tags: [],
  creator: { personal_info: {} },
  activity: {},
  banner: "",
  publishedAt: "",
};

export const BlogDetailContext = createContext({});

const BlogDetailPage = () => {
  const params = useParams();
  const { sendRequest } = useHttpClient();

  const { blogId } = params;
  const [loading, setLoading] = useState(false);

  const [blog, setBlog] = useState(blogObject);
  const [relatedBlogs, setRelatedBlogs] = useState(null);

  const [showComments, setShowComments] = useState(false);
  const [previousCommentsLoaded, setPreviousCommentsLoaded] = useState(0);

  let {
    title,
    content,
    tags,
    creator: {
      personal_info: { fullName, username, profileImage },
    },
    banner,
    publishedAt,
  } = blog;

  const getRelatedBlogs = async (page = 1) => {
    try {
      const responseData = await sendRequest(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/blogs/search-blogs?page=${page}&limit=2`,
        "POST",
        JSON.stringify({
          tag: tags[0],
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setRelatedBlogs(responseData.blogs);
    } catch (err) {
      setRelatedBlogs([]);
      console.error(err);
    }
  };

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/blogs/blog-details`,
        "POST",
        JSON.stringify({
          blogId: blogId,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      const commentsData = await fetchComments({
        blog_id: responseData?.blog?._id,
        setParentComponentCount: setPreviousCommentsLoaded,
      });

      setBlog({
        ...responseData.blog,
        comments: commentsData?.results?.comment,
      });
    } catch (err) {
      setBlog([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
    getRelatedBlogs();
  }, [blogId, tags[0]]);

  const similarBlogs =
    relatedBlogs && relatedBlogs.filter((blogs) => blogs.blogId !== blogId);

  return (
    <AnimationWrapper>
      <BlogDetailContext.Provider
        value={{
          blog,
          setBlog,
          showComments,
          setShowComments,
          previousCommentsLoaded,
          setPreviousCommentsLoaded,
        }}
      >
        <CommentDrawer />
        {loading ? (
          <LoadingSpinner asOverlay />
        ) : (
          <div className="flex flex-col justify-center max-w-[56rem] mx-auto pt-10 max-lg:px-[5vw]">
            <div className="w-full h-[30rem] flex justify-center items-center text-center mb-5 border-r-[50%] bg-grey">
              <img src={banner} alt="Preview" />
            </div>

            <p className="text-black text-4xl font-semibold my-5 capitalize">
              {title}
            </p>

            <div className="flex flex-col justify-center md:flex-row md:justify-between md:items-center gap-5">
              <div className="flex items-center gap-5">
                <Link to={`/user/${username}`}>
                  <img className="w-12 h-12 rounded-full" src={profileImage} />
                </Link>
                <div>
                  <p>{fullName}</p>
                  <p>@{username}</p>
                </div>
              </div>
              <p className="text-dark-grey text-xl my-5">
                Published on {extractTime(publishedAt)}
              </p>
            </div>
            <BlogQuality />

            <div className="my-10 blog-page-content">
              {content &&
                content[0]?.blocks.map((block, index) => {
                  return (
                    <div key={index} className="my-4 md:my-8">
                      <BlogContent block={block} />
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        <div className="flex flex-col justify-center max-w-[56rem] center pb-10 max-lg:px-[5vw]">
          {similarBlogs === null ? (
            [...Array(1)].map((_, idx) => <SearchUserSkeleton key={idx} />)
          ) : similarBlogs.length ? (
            similarBlogs.map((blog, index) => {
              return (
                <AnimationWrapper
                  key={index}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  <Blog blog={blog} author={blog.creator.personal_info} />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoDataFound message="No related blogs found" />
          )}
        </div>
      </BlogDetailContext.Provider>
    </AnimationWrapper>
  );
};

export default BlogDetailPage;
