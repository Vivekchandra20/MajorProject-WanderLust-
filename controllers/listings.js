const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
  const listings = await Listing.find({}).populate({
    path: "reviews",
    select: "rating",
  });

  const allListings = listings.map((listing) => {
    const reviewsCount = listing.reviews.length;
    const totalRating = listing.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    const avgRating = reviewsCount > 0 ? totalRating / reviewsCount : 0;

    return {
      ...listing.toObject(),
      reviewsCount,
      avgRating: Number(avgRating.toFixed(1)),
    };
  });

  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("success", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let location = req.body.listing.location;

  const data = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      location
    )}`
  ).then((res) => res.json());

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  // Handle amenities array - if no amenities selected, set to empty array
  if (!req.body.listing.amenities) {
    newListing.amenities = [];
  } else if (typeof req.body.listing.amenities === 'string') {
    // If only one amenity is selected, it comes as a string
    newListing.amenities = [req.body.listing.amenities];
  } else {
    // Multiple amenities come as an array
    newListing.amenities = req.body.listing.amenities;
  }

  if (!data || data.length === 0) {
    req.flash("error", "Could not find coordinates for this location");
    return res.redirect("/listings/new");
  }

  const firstResult = data[0];
  const lat = parseFloat(firstResult.lat);
  const lon = parseFloat(firstResult.lon);
  newListing.geometry = {
    type: "Point",
    coordinates: [lon, lat],
  };

  await newListing.save();
  req.flash("success", "New listing is created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("./listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  
  // Handle amenities array - if no amenities selected, set to empty array
  if (!req.body.listing.amenities) {
    req.body.listing.amenities = [];
  } else if (typeof req.body.listing.amenities === 'string') {
    // If only one amenity is selected, it comes as a string
    req.body.listing.amenities = [req.body.listing.amenities];
  }
  // Multiple amenities come as an array and don't need conversion

  // Handle image update if new file uploaded
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    req.body.listing.image = { url, filename };
  } else if (!req.body.listing.image || req.body.listing.image === "") {
    // If no new image, preserve the old image object
    req.body.listing.image = listing.image;
  } else if (typeof req.body.listing.image === "string") {
    // If only URL is provided, update just the url property
    req.body.listing.image = {
      ...listing.image,
      url: req.body.listing.image,
    };
  }

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", " Listing Updated.");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is deleted");
  res.redirect("/listings");
};
