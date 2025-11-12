/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import AboutSection from "./AboutSection";
import { AuthContext } from "../../shared/context/auth-context";
import InPageNavigation from "../home/InPageNavigation";
import BlogSkeleton from "../../components/skeletons/BlogSkeleton";
import AnimationWrapper from "../../shared/components/animation/page-animation";
import NoDataFound from "../../components/skeletons/NoDataFound";
import Blog from "../../components/blogs/Blog";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

export const profileObject = {
  personal_info: {
    fullName: "",
    username: "",
    bio: "",
    profileImage: "",
  },
  social_links: {},
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  joinedAt: "",
};

const UserProfilePage = () => {
  const params = useParams();
  const { sendRequest } = useHttpClient();

  const [userProfile, setUserProfile] = useState(profileObject);
  const [loading, setLoading] = useState(false);
  const { loggedInUser } = useContext(AuthContext);

  let {
    personal_info: { fullName, username, bio, profileImage },
    social_links,
    account_info: { total_posts, total_reads },
    joinedAt,
  } = userProfile;

  let [blogs, setBlogs] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUserBlogs = async (page = 1) => {
    try {
      const responseData = await sendRequest(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_URL
        }/api/blogs/user-blogs?page=${page}&limit=2`,
        "POST",
        JSON.stringify({
          username: params.username,
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

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/user-profile`,
        "POST",
        JSON.stringify({
          username: params.username,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setUserProfile(responseData.users);
    } catch (err) {
      setUserProfile([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchUserProfile();
    fetchUserBlogs(currentPage);
  }, [params.username, currentPage]);

  return (
    <section className="h-cover md:flex flex-row-reverse items-start justify-center gap-10 overflow-y-scroll">
      <div className="min-w-[20rem] mx-auto md:border-l md:border-dark-grey md:sticky md:top-[100px]">
        {loading ? (
          <div className="flex flex-col justify-center items-center mt-36">
            <LoadingSpinner asOverlay />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-5">
            <img src={profileImage} className="w-24 h-24 rounded-full" />
            <h1 className="text-xl font-semibold">{username}</h1>
            <p className="text-dark-grey capitalize">{fullName}</p>
            <p className="text-dark-grey">{`${total_posts} Blogs - ${total_reads} Reads`}</p>

            {loggedInUser &&
              loggedInUser.personal_info.username === username && (
                <div className="my-4">
                  <Link className="btn-grey" to={`/settings/edit-profile`}>
                    Edit Profile
                  </Link>
                </div>
              )}

            <div className="min-w-[20rem] mx-auto my-5">
              <AboutSection
                className="max-md:hidden"
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </div>
          </div>
        )}
      </div>

      <div className="max-md:mt-10 w-full">
        <InPageNavigation
          routes={["Blogs Published", "About"]}
          smHidden={["About"]}
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

            {blogs !== null && blogs.length && (
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
            )}
          </div>

          <div>
            <AboutSection
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>
        </InPageNavigation>
      </div>
    </section>
  );
};

export default UserProfilePage;
