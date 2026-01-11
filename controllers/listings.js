const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};


module.exports.createListing = async (req, res) => {
  const listingData = req.body.listing;
  if (listingData.categories) {
    listingData.categories = listingData.categories.map(c =>
      c.toLowerCase()
    );
  } else {
    listingData.categories = [];
  }

  const listing = new Listing(listingData);
  await listing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  return res.render("listings/edit.ejs", { listing });
};


module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  // const oldLocation = listing.location;
  const newLocation = req.body.listing.location;

  // update normal fields
  listing.title = req.body.listing.title;
  listing.description = req.body.listing.description;
  listing.price = req.body.listing.price;
  listing.location = newLocation;
  listing.country = req.body.listing.country;

  // update image if new file uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.searchListings = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.redirect("/listings");
  }

  const keywords = q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const keyword = q.toLowerCase().trim();
  const listings = await Listing.find({
    $or: [
      { categories: { $elemMatch: { $eq: keyword } } },
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { location: { $regex: keyword, $options: "i" } },
      { country: { $regex: keyword, $options: "i" } }
    ]
  });
  res.render("listings/index.ejs", { allListings: listings });
};


module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","New Listing  Deleted!");
  return res.redirect("/listings");
};