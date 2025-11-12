// import { useState } from "react";
// import { FaReply, FaHeart, FaRegHeart } from "react-icons/fa";
// import CommentsElement from "./CommentsElement";

// const AllComment = ({ index, leftVal, comments }) => {
//   let {
//     comment,
//     commentedAt,
//     commented_by: {
//       personal_info: { username, profileImage },
//     },
//     _id,
//   } = comments;

//   console.log(comments);

//   const [showReplies, setShowReplies] = useState(false);

//   const toggleReplies = () => {
//     setShowReplies(!showReplies);
//   };

//   const toggleReply = () => {};

//   return (
//     <div className="w-full mb-4" style={{ paddingLeft: `${leftVal * 10}px` }}>
//       <div className="flex items-center gap-4">
//         <img src={profileImage} alt="User" className="w-10 h-10 rounded-full" />
//         <div>
//           <h4 className="font-semibold">{username}</h4>
//           <span className="text-sm text-gray-500">{commentedAt}</span>
//         </div>
//       </div>

//       <p className="mt-3 text-gray-700">{comment}</p>

//       <div className="mt-2 flex items-center gap-4 text-gray-600">
//         {comments && comments.isReplyLoaded && (
//           <button className="flex items-center" onClick={toggleReply}>
//             <FaRegHeart />
//             <span className="ml-1">Hide Reply</span>
//           </button>
//         )}

//         <button className="flex items-center" onClick={toggleReplies}>
//           <FaReply />
//           <span className="ml-1">Reply</span>
//         </button>
//       </div>

//       {/* && comment.children && comment.children.length > 0 */}
//       {showReplies && (
//         <div className="mt-4 w-2/3">
//           <CommentsElement
//             action="reply"
//             index={index}
//             replyingTo={_id}
//             setShowReplies={setShowReplies}
//           />
//         </div>
//       )}
//       {/* <div className="mt-4 pl-8">
//         {comment.children &&
//           comment.children.length > 0 &&
//           comment.children.map((reply, index) => (
//             <AllComment
//               key={index}
//               comments={reply}
//               leftVal={comment?.childrenLevel * 4}
//             />
//           ))}
//       </div> */}
//     </div>
//   );
// };

// export default AllComment;

// import { useState } from "react";
// import { FaReply, FaHeart, FaRegHeart } from "react-icons/fa";
// import CommentsElement from "./CommentsElement";

// const AllComment = ({ index, leftVal, comments }) => {
//   let {
//     comment,
//     commentedAt,
//     commented_by: {
//       personal_info: { username, profileImage },
//     },
//     _id,
//     children, // Added to render child comments (replies)
//   } = comments;

//   const [showReplies, setShowReplies] = useState(false);

//   const toggleReplies = () => {
//     setShowReplies(!showReplies);
//   };

//   return (
//     <div className="w-full mb-4" style={{ paddingLeft: `${leftVal * 10}px` }}>
//       <div className="flex items-center gap-4">
//         <img src={profileImage} alt="User" className="w-10 h-10 rounded-full" />
//         <div>
//           <h4 className="font-semibold">{username}</h4>
//           <span className="text-sm text-gray-500">{commentedAt}</span>
//         </div>
//       </div>

//       <p className="mt-3 text-gray-700">{comment}</p>

//       <div className="mt-2 flex items-center gap-4 text-gray-600">
//         <button className="flex items-center" onClick={toggleReplies}>
//           {showReplies ? <FaRegHeart /> : <FaReply />}
//           <span className="ml-1">{showReplies ? "Hide Replies" : "Reply"}</span>
//         </button>
//       </div>

//       {/* Conditionally render reply input field when user clicks Reply */}
//       {showReplies && (
//         <div className="mt-4 w-2/3">
//           <CommentsElement
//             action="reply"
//             index={index}
//             replyingTo={_id}
//             setShowReplies={setShowReplies}
//           />
//         </div>
//       )}

//       {/* Render replies (children) recursively */}
//       {children && children.length > 0 && (
//         <div className="mt-4 pl-8">
//           {children.map((reply, childIndex) => (
//             <AllComment
//               key={reply._id} // Ensure unique key with comment _id
//               index={childIndex}
//               leftVal={leftVal + 1} // Increase indentation level for nested replies
//               comments={reply}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllComment;

import { useState } from "react";
import { FaReply } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import CommentsElement from "./CommentsElement";
import AnimationWrapper from "../../shared/components/animation/page-animation";
import { extractTime } from "../../utils/extractTime";

const AllComment = ({ index, leftVal, comments }) => {
  let {
    comment,
    commentedAt,
    commented_by: {
      personal_info: { username, profileImage },
    },
    _id, // This should be available from the parent comment
    children, // For replies (children comments)
  } = comments;

  const [showReplies, setShowReplies] = useState(false);
  const [hideReply, setHideReply] = useState(!!comments.children);
  const [replyingToId, setReplyingToId] = useState(null); // Track the replyingTo ID

  const toggleInput = () => {
    setShowReplies(!showReplies);

    // Set the parent comment's _id as replyingTo when "Reply" is clicked
    if (!showReplies) {
      setReplyingToId(_id); // Pass the parent comment's _id
    } else {
      setReplyingToId(null); // Reset when hiding replies
    }
  };

  return (
    <div className="w-full mb-4" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="flex items-center gap-4">
        <img src={profileImage} alt="User" className="w-10 h-10 rounded-full" />
        <div>
          <h4 className="font-semibold">{username}</h4>
          <span className="text-sm text-gray-500">
            {extractTime(commentedAt)}
          </span>
        </div>
      </div>

      <p className="mt-3 text-gray-700">{comment}</p>

      <div className="mt-2 flex items-center gap-4 text-gray-600">
        {comments && !comments.parent && children && children.length ? (
          <button
            className="flex items-center p-2 hover:bg-grey transition-all duration-300"
            onClick={() => setHideReply((prev) => !prev)}
          >
            <AiOutlineMessage />
            <span className="ml-1">
              {hideReply && children.length
                ? "Hide Reply"
                : `${children.length} Reply`}
            </span>
          </button>
        ) : (
          ""
        )}
        <button
          className="flex items-center hover:underline hover:font-bold"
          onClick={toggleInput}
        >
          {showReplies ? <AiOutlineMessage /> : <FaReply />}
          <span className="ml-1">{showReplies ? "Hide Input" : "Reply"}</span>
        </button>
      </div>

      {replyingToId && showReplies && (
        <AnimationWrapper key={index}>
          <div className="mt-4 w-2/3">
            <CommentsElement
              action="reply"
              index={index}
              replyingTo={replyingToId}
              setShowReplies={setShowReplies}
            />
          </div>
        </AnimationWrapper>
      )}

      {children && children.length > 0 && hideReply && (
        <div className="mt-4 pl-8">
          {children.map((reply, childIndex) => (
            <AnimationWrapper key={childIndex}>
              <AllComment
                key={reply._id}
                index={childIndex}
                leftVal={leftVal + 1}
                comments={reply}
              />
            </AnimationWrapper>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllComment;
