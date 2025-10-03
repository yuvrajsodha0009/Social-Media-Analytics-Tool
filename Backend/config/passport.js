const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    { // <-- THIS OBJECT WAS MISSING
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: accessToken });
        const youtube = google.youtube({ version: "v3", auth: oauth2Client });

        const channelResponse = await youtube.channels.list({
          part: "snippet",
          mine: true,
        });
        
        let youtubeChannelPic = null;
        if (channelResponse.data.items && channelResponse.data.items.length > 0) {
          youtubeChannelPic = channelResponse.data.items[0].snippet.thumbnails.default.url;
        }

        let user = await User.findOne({ email: profile.emails[0].value });
        const googleProfilePic = (profile.photos && profile.photos.length > 0) 
                           ? profile.photos[0].value 
                           : null;

        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: "google_oauth",
            profilePic: googleProfilePic,
            youtubeChannelPic: youtubeChannelPic,
            youtubeAccessToken: accessToken,
            youtubeRefreshToken: refreshToken,
          });
          await user.save();
        } else {
          user.youtubeAccessToken = accessToken;
          user.youtubeRefreshToken = refreshToken;
          user.profilePic = googleProfilePic;
          user.youtubeChannelPic = youtubeChannelPic;
          await user.save();
        }

        const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: "5h" });
        return done(null, { id: user.id, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);