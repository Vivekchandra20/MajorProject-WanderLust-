const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure wishlist is always an array
userSchema.pre('save', function(next) {
    if (!this.wishlist) {
        this.wishlist = [];
    }
    next();
});

// Configure passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'username',
    usernameQueryFields: ['username'],
    selectFields: 'username email wishlist createdAt'
});

module.exports = mongoose.model("User", userSchema);