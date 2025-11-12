/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, Link } from "react-router-dom";
import InPageNavigation from "../../pages/home/InPageNavigation";
import BlogSkeleton from "../skeletons/BlogSkeleton";
import AnimationWrapper from "../../shared/components/animation/page-animation";
import Blog from "../blogs/Blog";
import NoDataFound from "../skeletons/NoDataFound";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import SearchUserSkeleton from "../skeletons/SearchUserSkeleton";

const SearchPage = () => {
  const { query } = useParams();
  let [blogs, setBlogs] = useState(null);
  let [users, setUsers] = useState(null);
  const { sendRequest } = useHttpClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let blogLimit = 2;

  const searchBlogs = async (page = 1) => {
    try {
      const responseData = await sendRequest(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/blogs/search-blogs?page=${page}&limit=${blogLimit}`,
        "POST",
        JSON.stringify({
          tag: query,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setBlogs(responseData.blogs);
      setCurrentPage(responseData.currentPage);
      setTotalPages(responseData.totalPages);
    } catch (err) {
      setBlogs([]);
      console.error(err);
    }
  };

  const searchUsers = async () => {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/blogs/search-users`,
        "POST",
        JSON.stringify({
          tag: query,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setUsers(responseData.users);
    } catch (err) {
      setUsers([]);
      console.error(err);
    }
  };

  useEffect(() => {
    searchBlogs(currentPage);
    searchUsers();
  }, [query, currentPage]);

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
    <div className="search-section h-cover flex justify-center gap-10">
      <div className="w-full md:w-3/5">
        <InPageNavigation
          routes={[`Search results for "${query}"`, "Users realated to search"]}
          smHidden={["Users realated to search"]}
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
          </div>

          <div>
            {users === null ? (
              [...Array(2)].map((_, idx) => <SearchUserSkeleton key={idx} />)
            ) : users.length ? (
              users.map((user, i) => {
                return (
                  <Link
                    to={`/user/${user.personal_info.username}`}
                    key={i}
                    className={`flex items-center gap-5 bg-white hover:bg-grey transition-all duration-300 p-4`}
                  >
                    <img
                      src={user.personal_info.profileImage}
                      className="w-8 h-8 rounded-full"
                    />

                    <div>
                      <h1 className="text-xl">{user.personal_info.fullName}</h1>
                      <p className="text-dark-grey">
                        {user.personal_info.username}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <NoDataFound message="No user found" />
            )}
          </div>
        </InPageNavigation>

        {blogs !== null && blogs.length > blogLimit ? (
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

      <div className="w-full md:w-2/5 mx-auto hidden lg:block">
        <h2 className="font-bold text-xl py-4">Users realated to search</h2>

        <div className="flex flex-col justify-center flex-wrap">
          {users === null ? (
            [...Array(2)].map((_, idx) => <SearchUserSkeleton key={idx} />)
          ) : users.length ? (
            users.map((user, i) => {
              return (
                <Link
                  to={`/user/${user.personal_info.username}`}
                  key={i}
                  className={`flex items-center gap-5 bg-white hover:bg-grey transition-all duration-300 p-4`}
                >
                  <img
                    src={user.personal_info.profileImage}
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <h1 className="text-xl">{user.personal_info.fullName}</h1>
                    <p className="text-dark-grey">
                      {user.personal_info.username}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <NoDataFound message="No user found" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
