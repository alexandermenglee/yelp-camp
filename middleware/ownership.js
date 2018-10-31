const express = require("express"),
      Campground = require("../models/campground");

var checkOwnership = (req, res, next) => {
  if(Campground.author.id.equals(currentUser._id)){
    return next();
  }
  res.redirect("/login");
}

module.exports = checkOwnership; 