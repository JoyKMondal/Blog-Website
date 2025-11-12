/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import InPageNavigation from "./InPageNavigation";
import { useHttpClient } from "../../shared/hooks/http-hook";
import BlogSkeleton from "../../components/skeletons/BlogSkeleton";
import Blog from "../../components/blogs/Blog";
import AnimationWrapper from "../../shared/components/animation/page-animation";
import TrendingBlog from "../../components/blogs/TrendingBlog";
import TrendingSkeleton from "../../components/skeletons/TrendingSkeleton";
import NoDataFound from "../../components/skeletons/NoDataFound";

const HomePage = () => {
  const categories = [
    "Programming",
    "Hollywood",
    "Film making",
    "Social Media",
    "Entertainment",
    "Technology",
    "Finances",
    "World Affairs",
  ];

  const { loading } = useContext(AuthContext);

  let [blogs, setBlogs] = useState(null);
  let [totalBlogsCount, setTotalBlogsCount] = useState(0);
  let [trendingBlogs, setTrendingBlogs] = useState(null);

  let [pageState, setPageState] = useState("home");

  const { sendRequest } = useHttpClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let blogLimit = 4;

  const fetchBlogs = async (page = 1) => {
    try {
      const responseData = await sendRequest(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/blogs/latest-blogs?page=${page}&limit=${blogLimit}`
      );
      setBlogs(responseData.blogs);
      setTotalBlogsCount(responseData?.totalBlogs);
      setCurrentPage(responseData.currentPage);
      setTotalPages(responseData.totalPages);
    } catch (err) {
      setBlogs([]);
      console.error(err);
    }
  };

  const fetchBlogsByCategory = async (page = 1) => {
    try {
      const responseData = await sendRequest(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/blogs/search-blogs?page=${page}&limit=${blogLimit}`,
        "POST",
        JSON.stringify({
          tag: pageState,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setBlogs(responseData.blogs);
      setTotalBlogsCount(responseData?.totalBlogs);
      setCurrentPage(responseData.currentPage);
      setTotalPages(responseData.totalPages);
    } catch (err) {
      setBlogs([]);
      console.error(err);
    }
  };

  const fetchTrendingBlogs = async () => {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/blogs/trending-blogs`
      );
      setTrendingBlogs(responseData.blogs);
    } catch (err) {
      setTrendingBlogs([]);
      console.error(err);
    }
  };

  useEffect(() => {
    if (pageState === "home") {
      fetchBlogs(currentPage);
    } else {
      fetchBlogsByCategory(currentPage);
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState, currentPage]);

  function showBlogByCategory(cat) {
    setBlogs(null);

    if (pageState === cat) {
      setPageState("home");
      return;
    }

    setPageState(cat);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Fragment>
      {loading && <LoadingSpinner asOverlay />}
      <div className="section h-cover flex justify-center gap-10">
        <div className="w-full md:w-3/5">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            smHidden={["trending blogs"]}
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
                      <Blog blog={blog} author={blog.creator.personal_info} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataFound message="No blogs found" />
              )}

              {blogs !== null && totalBlogsCount > blogLimit ? (
                <div className="join grid grid-cols-2 my-4">
                  <button
                    onClick={handlePreviousPage}
                    className="join-item btn btn-outline text-xl"
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                    className="join-item btn btn-outline text-xl"
                  >
                    Next
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>

            <div>
              {trendingBlogs === null ? (
                [...Array(3)].map((_, idx) => <BlogSkeleton key={idx} />)
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, index) => (
                  <AnimationWrapper
                    key={blog.blogId}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  >
                    <TrendingBlog blog={blog} index={index} />
                  </AnimationWrapper>
                ))
              ) : (
                <NoDataFound message="No trending blogs found" />
              )}
            </div>
          </InPageNavigation>
        </div>

        <div className="w-full md:w-2/5 mx-auto hidden lg:block">
          <h1 className="py-4 font-inter text-3xl font-medium max-md:text-2xl">
            Stories from all interests
          </h1>

          <div className="py-5 flex flex-wrap">
            {categories.map((cat, i) => {
              return (
                <button
                  onClick={() => showBlogByCategory(cat)}
                  key={i}
                  className={`whitespace-nowrap bg-grey text-black rounded-full py-2 px-6 text-xl capitalize hover:bg-opacity-80 transition-all duration-300 m-2 ${
                    pageState === cat ? "bg-purple text-white" : ""
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <h2 className="font-bold text-xl py-4 flex items-center gap-1">
            <span>Trending</span>
            <i className="fi fi-rr-arrow-trend-up"></i>
          </h2>

          <div className="py-4">
            {trendingBlogs === null ? (
              [...Array(2)].map((_, idx) => <TrendingSkeleton key={idx} />)
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, index) => (
                <AnimationWrapper
                  key={blog.blogId}
                  transition={{ duration: 1, delay: index * 0.1 }}
                >
                  <TrendingBlog blog={blog} index={index} />
                </AnimationWrapper>
              ))
            ) : (
              <NoDataFound message="No trending blogs found" />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HomePage;
