const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
require("dotenv").config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ where: { email: profile.emails[0].value } });
    if (!user) {
        user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            provider: "google"
        });
    }
    done(null, user);
}));

module.exports = passport;
