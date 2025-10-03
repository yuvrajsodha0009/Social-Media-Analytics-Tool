const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.readonly", 
      "https://www.googleapis.com/auth/yt-analytics.readonly", 
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    res.redirect(`http://localhost:5173/google-success?token=${req.user.token}`);
  }
);

module.exports = router;
