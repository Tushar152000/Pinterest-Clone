const express = require("express");
const router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const localstrategy = require("passport-local");
const upload= require("./multer");


passport.use(new localstrategy(userModel.authenticate()));

router.get("/profile", isLoggedIn,  async function (req, res, next) {
  const user= await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts");
  console.log( user);
  res.render("profile",{user});
});
router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash('error') }); // Fix the parentheses
});

router.get("/feed", function (req, res) {
  res.render("feed");
});
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/upload",isLoggedIn,  upload.single('file'), async function(req,res){
    if(!req.file){
      return res.status(404).send("no files were uploaded");

    }
   
    // Now jo file upload ki hai usko save karo aur us postki id ko user ko do 
    // And post ko UserId Do  
    const user= await userModel.findOne({username:req.session.passport.user});
    const post = await postModel.create({
      image:req.file.filename,
      imageText:req.body  .filecaption,
      user:user._id

    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");

})

router.get("/allUserPost", async function (req, res) {
  let userPosts = await userModel
    .findOne({ _id: "65a178c88781087b8bee1142" })
    .populate("posts");

  res.send(userPosts);
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile", // Update the path to include a leading '/'
    failureRedirect: "/login",
    failureFlash:true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
router.get("/createUser", async function (req, res) {
  let createduser = await userModel.create({
    username: "Tushar",
    password: "tushar12",
    posts: [],
    email: "tushar123@gmail.com",
    fullName: "Tushar Chauhan",
  });
  res.send(createduser);
});

router.get("/createPost", async function (req, res) {
  let createPost = await postModel.create({
    postText: "Hello Developers , Senior Developer Tushar ",
    user: "65a178c88781087b8bee1142",
  });
  let user = await userModel.findOne({ _id: "65a178c88781087b8bee1142" });
  user.posts.push(createPost._id);
  await user.save();
  res.send("Done");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}
// Registration route should come before the profile route
router.post("/register", function (req, res, next) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });

  userModel.register(userData, req.body.password, function (err, user) {
    if (err) {
      console.error(err);

      // Check for duplicate email error (code 11000)
      if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
        return res
          .status(400)
          .send("Email already exists. Please use a different email.");
      }

      // Handle other registration errors
      return res.status(500).send("Registration failed. Please try again.");
    }

    // Authenticate the user after successful registration
    passport.authenticate("local")(req, res, function () {
      // Redirect to the profile page upon successful registration and authentication
      res.redirect("/profile");
    });
  });
});

module.exports = router;
