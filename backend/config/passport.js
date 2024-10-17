const passport = require('passport');
const User = require('../models/userSchema');

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
