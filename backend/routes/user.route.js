// routes\user.route.js

const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/user.controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post(
  "/signup",
  [
    check("fullName").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

router.post("/google-auth", usersControllers.googleAuth);

router.post("/user-profile", usersControllers.getUserProfile);

router.post(
  "/update-profile-image",
  [checkAuth],
  usersControllers.updateProfileImage
);

router.patch(
  "/change-password",
  [
    checkAuth,
    check("currentPassword").isLength({ min: 6 }),
    check("newPassword").isLength({ min: 6 }),
  ],
  usersControllers.updatePassword
);

router.patch(
  "/update-profile",
  [checkAuth, check("bio").isLength({ min: 10 })],
  usersControllers.updateProfile
);

router.get(
  "/is-new-notification",
  [checkAuth],
  usersControllers.newNotificationExists
);

router.post(
  "/get-notifications",
  [checkAuth],
  usersControllers.getNotifications
);

router.post(
  "/count-notifications",
  [checkAuth],
  usersControllers.countNotifications
);

router.get("/:uid", usersControllers.getUserById);

module.exports = router;
