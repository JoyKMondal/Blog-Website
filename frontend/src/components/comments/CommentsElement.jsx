import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../../shared/context/auth-context";
import { BlogDetailContext } from "../../pages/blog/BlogDetailPage";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { data } from "autoprefixer";

const CommentsElement = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setShowReplies,
}) => {
  // console.log("Replying to:", replyingTo);
  let commentRef = useRef();
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();
  const { isLoggedIn, token, loggedInUser } = useContext(AuthContext);
  let {
    blog,
    blog: {
      _id,
      creator: { _id: blog_author },
      comments,
      comments: commentsArray,
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    previousCommentsLoaded,
    setPreviousCommentsLoaded,
  } = useContext(BlogDetailContext);

  const {
    personal_info: { fullName, username, profileImage },
  } = loggedInUser;

  // const handleComments = async () => {
  //   if (!isLoggedIn) {
  //     navigate("/auth");
  //   }

  //   let value = commentRef.current.value;
  //   if (value === "") {
  //     toast.error("Please put a comment!", { duration: 1000 });
  //   }

  //   try {
  //     const responseData = await sendRequest(
  //       `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/blogs/comment-blog`,
  //       "POST",
  //       JSON.stringify({
  //         _id,
  //         blog_author,
  //         comments: value,
  //         replyingTo: replyingTo,
  //       }),
  //       {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       }
  //     );

  //     responseData.commented_by = {
  //       personal_info: { fullName, username, profileImage },
  //     };

  //     let newCommentArray;

  //     if (replyingTo) {
  //       commentsArray[index].children.push(responseData);

  //       responseData.childrenLevel = commentsArray[index].childrenLevel + 1;
  //       responseData.parentIndex = index;

  //       commentsArray[index].isReplyLoaded = true;

  //       commentsArray.splice(index + 1, 0, responseData);
  //       // commentsArray[index].children = [...commentsArray[index].children, responseData];

  //       newCommentArray = commentsArray;

  //       // console.log(newCommentArray);

  //       setShowReplies(false);
  //     } else {
  //       responseData.childrenLevel = 0;
  //       newCommentArray = [responseData, ...commentsArray];
  //     }

  //     let parentCommentIncrementVal = replyingTo ? 0 : 1;

  //     setBlog({
  //       ...blog,
  //       // comments: { ...comments, newCommentArray },
  //       comments: newCommentArray,
  //       activity: {
  //         ...activity,
  //         total_comments: total_comments + 1,
  //         total_parent_comments:
  //           total_parent_comments + parentCommentIncrementVal,
  //       },
  //     });

  //     setPreviousCommentsLoaded((prev) => prev + parentCommentIncrementVal);
  //   } catch (err) {
  //     console.log(err);
  //   }

  //   commentRef.current.value = "";
  // };

  const handleComments = async () => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    const value = commentRef.current.value.trim();
    if (value === "") {
      toast.error("Please put a comment!", { duration: 1000 });
      return;
    }

    try {
      // Sending the comment/reply to the backend
      const responseData = await sendRequest(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/blogs/comment-blog`,
        "POST",
        JSON.stringify({
          _id, // Blog ID
          blog_author, // Blog author ID
          comments: value, // Comment text
          replyingTo, // Parent comment ID (if replying)
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      );

      // Add user personal info to display
      responseData.commented_by = {
        personal_info: { fullName, username, profileImage },
      };

      let newCommentArray;

      if (replyingTo) {
        // Handle reply to an existing comment
        const parentIndex = commentsArray.findIndex(
          (comment) => comment._id === replyingTo
        );

        if (parentIndex !== -1) {
          const parentComment = commentsArray[parentIndex];

          // Ensure parent comment has children array
          parentComment.children = parentComment.children || [];

          // Add the reply to the parent comment's children
          parentComment.children.push(responseData);

          // Update the children level based on the parent's childrenLevel
          responseData.childrenLevel = parentComment.childrenLevel + 1;
          responseData.parentIndex = parentIndex;

          // Mark that replies are loaded for this parent
          parentComment.isReplyLoaded = true;

          // Insert the reply directly after the parent in the array
          commentsArray.splice(parentIndex + 1, 0, responseData);

          // Update the comment array
          newCommentArray = [...commentsArray];
        }

        // Hide the reply input box after submitting a reply
        setShowReplies(prev => !prev);
      } else {
        // Handle top-level comment
        responseData.childrenLevel = 0;
        newCommentArray = [responseData, ...commentsArray]; // Prepend new comment
      }

      // Update the blog state with new comments and activity
      setBlog({
        ...blog,
        comments: newCommentArray,
        activity: {
          ...activity,
          total_comments: total_comments + 1,
          total_parent_comments: total_parent_comments + (replyingTo ? 0 : 1), // Increment parent count if it's a top-level comment
        },
      });

      // Increment the count of loaded comments for pagination purposes
      setPreviousCommentsLoaded((prev) => prev + (replyingTo ? 0 : 1));
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit comment. Please try again.");
    }

    // Clear the comment input field
    commentRef.current.value = "";
  };

  return (
    <div>
      <Toaster />
      <textarea
        ref={commentRef}
        className="textarea textarea-bordered w-full h-[7rem] text-xl bg-grey"
        placeholder="Leave a comment..."
      ></textarea>
      <button onClick={handleComments} className="btn-dark my-3 capitalize">
        {action}
      </button>
    </div>
  );
};

export default CommentsElement;
