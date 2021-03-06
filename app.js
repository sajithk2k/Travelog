var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport=require("passport"),
	LocalStrategy=require("passport-local"),
    methodOverride = require("method-override"),
    Place = require("./models/place"),
    User = require("./models/user");

var placeRoutes = require("./routes/places"),
    indexRoutes = require("./routes/index");

//Mongoose configuration
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/travelog2");
    
app.use(express.static(__dirname +"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "I am the one who knocks-Walter White",
	resave: false,
	saveUninitialized: false
}));

//Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//USING DEFINED ROUTES
app.use("/",indexRoutes);
app.use("/",placeRoutes);

app.listen(3000,function(){
    console.log("TRAVELOG Server has started");
});
