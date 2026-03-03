const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const wishlistController = require("../controllers/wishlist");

// View wishlist
router.get("/", isLoggedIn, wrapAsync(wishlistController.renderWishlist));

// Add to wishlist
router.post("/add/:id", isLoggedIn, wrapAsync(wishlistController.addToWishlist));

// Remove from wishlist
router.delete("/:id", isLoggedIn, wrapAsync(wishlistController.removeFromWishlist));

module.exports = router;
