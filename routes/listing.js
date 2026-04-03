const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
//  validation for schema (using middleware)
const validateListing = (req, res, next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}
// index Route
router.get("/", wrapAsync(async (req, res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
}));
// New Route
router.get("/new",isLoggedIn, (req, res)=>{
    res.render("listings/new.ejs")
})
// Show route
router.get("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing)
    res.render("listings/show.ejs", {listing});
}));
// create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req, res, next)=>{
        if (!req.body.listing.image || !req.body.listing.image.url) {
            delete req.body.listing.image;
        }
        const newListing = new Listing(req.body.listing);
        // console.log(req.user);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!")
        res.redirect("/listings")
    // let {title, description, image, price, country, location} = req.body   
}));
//Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    } 
    res.render("listings/edit.ejs", {listing})
}));
// Update Route
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req, res)=>{
    if(!req.body || !req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`)
}));
//delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!")
    res.redirect("/listings")
}));
module.exports = router;
