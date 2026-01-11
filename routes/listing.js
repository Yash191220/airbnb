const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
// const Review = require("../models/review.js");
const reviewRouter = require("./review.js");
const { isLoggedIn } = require("../middleware.js");

const attachImage = (req, res, next) => {
  if (req.file) {
    req.body.listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  next();
};

const validateListing = (req,res,next) =>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    return next (new ExpressError(400,errMsg));
  }else{
    next();
  }
};

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/search", wrapAsync(listingController.searchListings));
router.route("/")
.get(wrapAsync(listingController.index))
// .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));
.post(
  isLoggedIn,
  upload.single("image"),
  attachImage,
  validateListing,
  wrapAsync(listingController.createListing)
);


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, upload.single("image"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(listingController.renderEditForm));

router.use("/:id/reviews", reviewRouter);

module.exports = router;