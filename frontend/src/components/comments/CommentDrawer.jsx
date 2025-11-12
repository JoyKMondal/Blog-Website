import { useContext } from "react";
import AnimationWrapper from "../../shared/components/animation/page-animation";
import NoDataFound from "../skeletons/NoDataFound";
import AllComment from "./AllComment";
import CommentsElement from "./CommentsElement";
import { BlogDetailContext } from "../../pages/blog/BlogDetailPage";

// export const fetchComments = async ({
//   skip = 0,
//   blog_id,
//   setParentComponentCount,
//   comment_array = null,
// }) => {
//   let res;

//   try {
//     const response = await fetch(
//       `${
//         import.meta.env.VITE_REACT_APP_BACKEND_URL
//       }/api/blogs/get-blog-comments`,
//       {
//         method: "POST",
//         body: JSON.stringify({
//           blog_id,
//           skip,
//         }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const responseData = await response.json();

//     if (responseData && Array.isArray(responseData.comment)) {
//       responseData.comment.map((comment) => {
//         comment.childrenLevel = 0;
//       });
//     }

//     // setParentComponentCount((prev) => prev + responseData?.comment?.length);
//     setParentComponentCount(responseData?.comment?.length);

//     if (comment_array === null) {
//       res = { results: responseData };
//     } else {
//       res = { results: { ...comment_array, ...responseData } };
//     }

//     return res;
//   } catch (err) {
//     console.error(err);
//   }
// };

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentComponentCount,
  comment_array = null,
}) => {
  let res;

  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_REACT_APP_BACKEND_URL
      }/api/blogs/get-blog-comments`,
      {
        method: "POST",
        body: JSON.stringify({
          blog_id,
          skip,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = await response.json();

    if (responseData && Array.isArray(responseData.comment)) {
      // Loop through parent comments
      responseData.comment.forEach((parentComment) => {
        // Set parent comment's childrenLevel to 0 (top level)
        parentComment.childrenLevel = 0;

        // Check if the parent comment has replies (children)
        if (
          Array.isArray(parentComment.children) &&
          parentComment.children.length > 0
        ) {
          // Loop through each child comment and assign childrenLevel dynamically
          parentComment.children.forEach((childComment) => {
            childComment.childrenLevel = 1; // Direct replies have level 1

            // If the reply also has children (nested replies), assign childrenLevel
            if (
              Array.isArray(childComment.children) &&
              childComment.children.length > 0
            ) {
              childComment.children.forEach((nestedReply) => {
                nestedReply.childrenLevel = 2; // Nested replies have level 2
              });
            }
          });
        }
      });
    }

    // Set the parent component count for top-level comments only
    setParentComponentCount(
      (prev) =>
        prev +
        responseData?.comment?.filter((c) => c.childrenLevel === 0).length
    );

    // If comment_array is null, assign the responseData to res
    if (comment_array === null) {
      res = { results: responseData };
    } else {
      // If there is an existing comment array, merge the new data with the existing array
      res = { results: { ...comment_array, ...responseData } };
    }

    return res;
  } catch (err) {
    console.error(err);
  }
};

const CommentDrawer = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      comments: commentsArray,
      activity: { total_parent_comments },
    },
    setBlog,
    previousCommentsLoaded,
    setPreviousCommentsLoaded,
  } = useContext(BlogDetailContext);

  const loadMoreComments = async () => {
    const commentsArr = await fetchComments({
      skip: previousCommentsLoaded,
      blog_id: _id,
      setParentComponentCount: setPreviousCommentsLoaded,
      comment_array: commentsArray,
    });

    let newCommentArray;

    let array = commentsArr?.results?.comment;
    newCommentArray = [...commentsArray, ...array];

    setBlog({
      ...blog,
      comments: newCommentArray,
    });
  };

  return (
    <div className="drawer drawer-end z-50">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-white text-base-content min-h-full flex flex-col w-1/3 max-sm:w-full lower-medium-screen:w-3/5 higher-medium-screen:w-5/12 p-8 z-50 px-16 overflow-y-auto overflow-x-hidden relative">
          <div className="flex justify-between items-center">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="btn btn-md btn-circle btn-ghost absolute right-8 top-4 p-4 hidden max-sm:block"
            >
              <i className="fi fi-br-cross"></i>
            </label>
            <div>
              <h3 className="font-inter font-semibold py-2 text-black">
                Comments
              </h3>
              <p className="text-xl capitalize text-dark-grey">{title}</p>
            </div>
          </div>
          <hr className="border-dark-grey my-4" />
          <CommentsElement action="comment" />

          {commentsArray && commentsArray.length ? (
            commentsArray.map((comment, index) => {
              return (
                <AnimationWrapper key={index}>
                  <div className="my-4">
                    <AllComment
                      index={index}
                      leftVal={comment?.childrenLevel * 4}
                      comments={comment}
                    />
                  </div>
                </AnimationWrapper>
              );
            })
          ) : (
            <NoDataFound message="no comments found" />
          )}

          {total_parent_comments > previousCommentsLoaded && (
            <button onClick={loadMoreComments} className="btn btn-sm w-1/3">
              Load More
            </button>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommentDrawer;
