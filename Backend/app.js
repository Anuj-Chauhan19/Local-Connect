require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const cors = require('cors');
const jwt = require('jsonwebtoken');

const userRouter = require("./routes/user.js");
const eventRouter = require("./routes/event.js");
const reviewRouter = require("./routes/review.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: false, 
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1*60*60*1000
  }
};

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

app.get("/",(req,res)=>{
    res.render("pages/home.ejs");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


app.use("/",userRouter);
app.use("/events",eventRouter);
app.use("/events/:id/reviews",reviewRouter);


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload._id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}));


const MONGO_URL = "mongodb://127.0.0.1:27017/localConnect!";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err.message);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};

app.use((err,req,res,next)=>{
    let {status=500, message="Something Went wrong"} = err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});




app.listen(8080,()=>{
    console.log("server is running on port 8080");
});