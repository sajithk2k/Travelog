var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Place = require("../models/place");

//SHOW-Shows all visited places(default)
router.get("/places", isLoggedIn,function(req,res){
	Place.find({},function(err,allPlaces){
		if(err){
			console.log(err);
		} else{
			res.render("visited",{places:allPlaces});
		}
	});
});

//BUCKET-Shows all bucket list places
router.get("/places/bucket", isLoggedIn,function(req,res){
	Place.find({},function(err,allPlaces){
		if(err){
			console.log(err);
		} else{
			res.render("bucket",{places:allPlaces});
		}
	});
});

//NEW-Renders form to create a new place
router.get("/places/new", isLoggedIn,function(req,res){
    res.render("new");
});

//CREATE-Add a new place to DB
router.post("/places", isLoggedIn,function(req,res){
    var name = req.body.name,
        image = req.body.image,
        info = req.body.info,
        isVisited = req.body.isVisited,
        isBucket = req.body.isBucket,
        date = req.body.date;
        username=req.user.username;
    var newPlace = {
                    name: name,
                    image: image,
                    info: info,
                    isVisited: isVisited,
                    isBucket: isBucket,
                    date: date,
                    username: username
    }

    Place.create(newPlace, function(err, newlyCreated){
		if(err)
		{
			console.log(err)
		}else{
			res.redirect("/places");
		}
	});
});

//VIEW AND EDIT FORM
router.get("/places/:id/show",  isLoggedIn,function(req,res){
		
    Place.findById(req.params.id,function(err, foundPlace){
            res.render("show",{place: foundPlace});
            });
    });

//UPDATE PLACE 
router.put("/places/:id", isLoggedIn,function(req,res){
    
    req.body.place.isVisited=Boolean(req.body.place.isVisited);
    req.body.place.isBucket=Boolean(req.body.place.isBucket);
    console.log(req.body.place);
	Place.findByIdAndUpdate(req.params.id,req.body.place,function(err,editedPlace){
		if(err){
            console.log(err);
			res.redirect("/places");
		} else{
            res.redirect("/places");
            console.log(editedPlace);
		}
	});
});

//DELETE PLACE
router.delete("/places/:id" , isLoggedIn,function(req,res){
	Place.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/places");
		} else{
			res.redirect("/places");
		}
	});
});

//CHECK LOGIN MIDDLEWARE
function isLoggedIn(req, res, next){	
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/");
}

module.exports= router;