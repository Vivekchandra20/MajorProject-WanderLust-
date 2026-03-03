const User = require("../models/user");
const Listing = require("../models/listing");
const mongoose = require("mongoose");

// Render wishlist page
module.exports.renderWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist").exec();
    console.log("📋 Rendering wishlist for user:", req.user._id);
    console.log("📋 User wishlist items:", user.wishlist.length);
    res.render("users/wishlist.ejs", { wishlist: user.wishlist || [] });
  } catch (err) {
    console.log("❌ Error rendering wishlist:", err);
    req.flash("error", "Error loading wishlist");
    res.redirect("/listings");
  }
};

// Add listing to wishlist
module.exports.addToWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("\n🔥 ===== ADD TO WISHLIST START =====");
    console.log("📌 Listing ID:", id);
    console.log("👤 User ID:", req.user._id);
    
    // Verify listing exists
    const listing = await Listing.findById(id);
    console.log("✅ Listing found:", listing ? listing.title : "NOT FOUND");
    
    if (!listing) {
      console.log("❌ Listing not found!");
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    
    // Fetch user
    const user = await User.findById(req.user._id);
    console.log("📊 Wishlist BEFORE (length):", user.wishlist ? user.wishlist.length : 0);
    console.log("📊 Wishlist BEFORE (array):", user.wishlist);
    console.log("📊 User object keys:", Object.keys(user));
    
    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      console.log("⚠️  Wishlist was undefined, initializing...");
      user.wishlist = [];
    }
    
    // Check if listing is already in wishlist
    const isAlreadyThere = user.wishlist.some(item => item.toString() === id.toString());
    console.log("🔍 Already in wishlist?", isAlreadyThere);
    
    if (!isAlreadyThere) {
      // Add the listing ID to wishlist
      user.wishlist.push(id);  // Just push the string id directly
      console.log("➕ Added ID to array");
      console.log("📊 Array after push:", user.wishlist);
      
      // Mark the field as modified
      user.markModified('wishlist');
      console.log("✏️  Marked wishlist as modified");
      
      // Save the user document
      const savedUser = await user.save();
      console.log("💾 User saved to database");
      console.log("💾 Saved user wishlist:", savedUser.wishlist);
      
      // Fetch again to verify
      const userAfter = await User.findById(req.user._id);
      console.log("📊 Wishlist AFTER (length):", userAfter.wishlist ? userAfter.wishlist.length : 0);
      console.log("📊 Wishlist AFTER (array):", userAfter.wishlist);
      
      req.flash("success", "Added to your wishlist!");
    } else {
      console.log("⚠️  Already in wishlist!");
      req.flash("error", "Already in your wishlist!");
    }
    
    console.log("✅ Successfully processed!");
    console.log("🔥 ===== ADD TO WISHLIST END =====\n");
    
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log("\n❌ ===== ADD TO WISHLIST ERROR =====");
    console.log("Error message:", err.message);
    console.log("Error name:", err.name);
    console.log("Error stack:", err.stack);
    console.log("❌ ===== ERROR END =====\n");
    req.flash("error", "Error adding to wishlist: " + err.message);
    res.redirect(`/listings/${req.params.id}`);
  }
};

// Remove listing from wishlist
module.exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("\n🗑️  ===== REMOVE FROM WISHLIST START =====");
    console.log("📌 Listing ID:", id);
    console.log("👤 User ID:", req.user._id);
    
    const user = await User.findById(req.user._id);
    console.log("📊 Wishlist BEFORE:", user.wishlist);
    
    // Remove the listing from wishlist
    user.wishlist = user.wishlist.filter(item => item.toString() !== id.toString());
    console.log("📊 Wishlist AFTER:", user.wishlist);
    
    // Save the user document
    await user.save();
    console.log("💾 User saved to database");
    
    console.log("✅ Successfully removed from wishlist!");
    console.log("🗑️  ===== REMOVE FROM WISHLIST END =====\n");
    
    req.flash("success", "Removed from your wishlist!");
    res.redirect("/wishlist");
  } catch (err) {
    console.log("\n❌ ===== REMOVE ERROR =====");
    console.log("Error message:", err.message);
    console.log("Error stack:", err.stack);
    console.log("❌ ===== ERROR END =====\n");
    req.flash("error", "Error removing from wishlist");
    res.redirect("/wishlist");
  }
};
