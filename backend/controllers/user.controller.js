// controllers\user.controller.js

const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { getAuth } = require("firebase-admin/auth");

const HttpError = require("../models/http-error");
const Users = require("../models/users.model");
const Notification = require("../models/notification.model");

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { fullName, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await Users.findOne({ "personal_info?.email": email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later1.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Hashing password failed, please try again. ",
      500
    );
    return next(error);
  }

  const username = (email.split("@")[0] += uuidv4().substring(0, 5));

  const createdUser = new Users({
    personal_info: {
      fullName,
      email,
      password: hashedPassword,
      username,
    },
  });

  try {
    // await Users.collection.dropIndex("email_1");
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating User failed, please try again.", 500);
    console.log("Error details:", err);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.personal_info.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.personal_info.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    existingUser = await Users.findOne({ "personal_info.email": email });
  } catch (err) {
    const error = new HttpError(
      "Finding user failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "User doesn't exists, could not log you in.",
      403
    );
    return next(error);
  }

  if (existingUser.google_auth) {
    const error = new HttpError(
      "Account was created using google. Try logging in with google.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password,
      existingUser.personal_info.password
    );
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Password isnot correct, could not log you in. ",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.personal_info.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing in failed, could not log you in. ",
      403
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.personal_info.email,
    token: token,
  });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;

  let user;
  try {
    user = await Users.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user for the provided user id.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find a user for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const getUserProfile = async (req, res, next) => {
  try {
    let { username } = req.body;
    const users = await Users.findOne({
      "personal_info.username": username,
    }).select("-personal_info.password -google_auth -updatedAt -blogs");

    // if (!users || users.length === 0) {
    //   const error = new HttpError("No blogs found.", 404);
    //   return next(error);
    // }

    res.status(200).json({
      users,
    });
  } catch (err) {
    const error = new HttpError("Fetching users failed!", 500);
    return next(error);
  }
};

const googleAuth = async (req, res, next) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      picture = picture?.replace("s96-c", "s384-c");

      let user = await Users.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullName personal_info.username personal_info.profileImage google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return next(new HttpError(err.message, 500));
        });

      if (user) {
        if (!user.google_auth) {
          return next(
            new HttpError(
              "This email was signed up without google. You can sign in with the email.",
              403
            )
          );
        }
      } else {
        let username = (email.split("@")[0] += uuidv4().substring(0, 5));

        user = new Users({
          personal_info: {
            fullName: name,
            email,
            profileImage: picture,
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return next(new HttpError(err.message, 500));
          });
      }

      let token;
      try {
        token = jwt.sign(
          { userId: user.id, email: user.personal_info.email },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
      } catch (err) {
        const error = new HttpError(
          "Signing up failed, please try again.",
          500
        );
        return next(error);
      }

      res.json({
        userId: user.id,
        email: user.personal_info.email,
        token: token,
      });
    })
    .catch((err) => {
      console.log(err, "full error");
      const error = new HttpError(
        "Failed to authenticate you with google, please try again.",
        500
      );
      return next(error);
    });
};

const updatePassword = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { currentPassword, newPassword } = req.body;
  const userId = req.userData.userId;

  if (currentPassword === newPassword) {
    return next(
      new HttpError("Both password are same. Try again with another one!", 404)
    );
  }

  let user;
  try {
    user = await Users.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Could not find user for the provided user ID.",
      500
    );
    return next(error);
  }

  if (!user) {
    return next(new HttpError("User not found.", 404));
  }

  if (user.google_auth) {
    return next(
      new HttpError(
        "You cannot change the password for Google-authenticated accounts.",
        403
      )
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "Hashing password failed, please try again later.",
      500
    );
    return next(error);
  }

  user.personal_info.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      "Saving user failed, could not update the password.",
      500
    );
    return next(error);
  }

  res.status(200).json({ user: user, message: "Password Changed!" });
};

const updateProfileImage = async (req, res, next) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return next(new HttpError("image URL are required.", 400));
  }

  try {
    const updatedUser = await Users.findOneAndUpdate(
      { _id: req.userData.userId },
      { "personal_info.profileImage": imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return next(new HttpError("User not found", 404));
    }

    return res.status(200).json({
      message: "Profile image updated successfully.",
      url: imageUrl,
    });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

const updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        "Invalid inputs passed, Bio at least 10 characters long!.",
        422
      )
    );
  }

  const {
    bio,
    youtube = "",
    instagram = "",
    facebook = "",
    twitter = "",
    github = "",
    website = "",
  } = req.body;

  const userId = req.userData.userId;

  const validateUrl = (link) => {
    return link === "" || link.startsWith("https://");
  };

  if (
    !validateUrl(facebook) ||
    !validateUrl(youtube) ||
    !validateUrl(twitter) ||
    !validateUrl(instagram) ||
    !validateUrl(website) ||
    !validateUrl(github)
  ) {
    return next(new HttpError("All URLs must start with https://", 422));
  }

  try {
    const updatedUser = await Users.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          "personal_info.bio": bio,
          "social_links.youtube": youtube,
          "social_links.instagram": instagram,
          "social_links.facebook": facebook,
          "social_links.twitter": twitter,
          "social_links.github": github,
          "social_links.website": website,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new HttpError("User not found.", 404));
    }

    res
      .status(200)
      .json({ user: updatedUser, message: "User profile updated!" });
  } catch (err) {
    return next(
      new HttpError("Updating user failed, please try again later.", 500)
    );
  }
};

const newNotificationExists = async (req, res) => {
  try {
    const loggedInUserId = req.userData.userId;

    const notificationExists = await Notification.exists({
      notification_for: loggedInUserId,
      user: { $ne: loggedInUserId },
      seen: false,
    });

    if (notificationExists) {
      res.status(200).json({
        success: true,
        message: "New notifications exist",
        newNotification: true,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No new notifications",
        newNotification: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const getNotifications = async (req, res) => {
  const { type } = req.body;
  // const userId = mongoose.Types.ObjectId(req.userData.userId);
  const userId = req.userData.userId;

  try {
    let notifications;

    const query = { notification_for: userId, user: { $ne: userId } };

    if (type !== "all") {
      query.type = type;
    }

    notifications = await Notification.find(query)
      .populate("blog", "title blogId")
      .populate(
        "user",
        "personal_info.fullName personal_info.username personal_info.profileImage"
      )
      .populate("comment", "comment")
      .populate("reply", "comment")
      .populate("replied_on_comment", "comment")
      .sort({ createdAt: -1 })
      .select("createdAt type seen reply")
      .exec();

    await Notification.updateMany(query, { seen: true });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications.",
    });
  }
};

const countNotifications = async (req, res) => {
  const { type } = req.body;
  // const userId = mongoose.Types.ObjectId(req.userData.userId);
  const userId = req.userData.userId;

  try {
    let count;

    const query = { notification_for: userId, user: { $ne: userId } };

    if (type !== "all") {
      query.type = type;
    }

    count = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error counting notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to count notifications.",
    });
  }
};

exports.signup = signup;
exports.login = login;
exports.getUserById = getUserById;
exports.googleAuth = googleAuth;
exports.getUserProfile = getUserProfile;
exports.updatePassword = updatePassword;
exports.updateProfileImage = updateProfileImage;
exports.updateProfile = updateProfile;
exports.newNotificationExists = newNotificationExists;
exports.getNotifications = getNotifications;
exports.countNotifications = countNotifications;
