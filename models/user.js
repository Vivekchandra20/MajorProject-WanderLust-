const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passwordLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true
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

userSchema.plugin(passwordLocalMongoose);
module.exports= mongoose.model("User",userSchema);