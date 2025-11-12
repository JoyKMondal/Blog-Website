// routes/blog.route.js
const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");

const blogsControllers = require("../controllers/blog.controller");

const router = express.Router();

router.get("/latest-blogs", blogsControllers.getLatestBlogs);
router.get("/trending-blogs", blogsControllers.getTrendingBlogs);
router.post("/search-blogs", blogsControllers.postSearchBlogs);
router.post("/search-users", blogsControllers.getUsersByBlogTags);
router.post("/user-blogs", blogsControllers.postUserBlogs);

router.post("/all-blogs", [checkAuth], blogsControllers.getAllBlogs);

router.post("/blog-details", blogsControllers.getBlogById);

router.post("/get-blog-comments", blogsControllers.getBlogComments);

router.use(checkAuth);

router.post(
  "/create-blog",
  [
    check("title").notEmpty().withMessage("Title is required"),

    check("description")
      .notEmpty()
      .isLength({ max: 200 })
      .withMessage("Description must be ≤ 200 characters"),

    check("banner").notEmpty().withMessage("Banner is required"),

    check("content").notEmpty().withMessage("Content is required"),

    check("tags")
      .isArray({ min: 1, max: 10 })
      .withMessage("Provide 1–10 tags"),

    check("tags.*")
      .isString()
      .trim()
      .isLength({ min: 1, max: 32 })
      .withMessage("Each tag must be 1–32 characters")
      .matches(/^[a-zA-Z0-9\s-]+$/)
      .withMessage("Tags can only contain letters, numbers, spaces, and hyphens"),
  ],
  blogsControllers.createBlog
);

router.delete("/delete-blog", blogsControllers.deleteBlogs);

router.post("/toggle-like-blog", blogsControllers.toggleLikeBlog);

router.get("/is-liked/:blogId", blogsControllers.checkUserLike);

router.post("/comment-blog", blogsControllers.commentBlog);

module.exports = router;
