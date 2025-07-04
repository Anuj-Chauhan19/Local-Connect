const mongoose = require("mongoose");
const Schema  = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    currentResidence: {
        type: String,
        required: true,
    },
    localAddress: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    documents: [{
        type: {
            type: String,
            enum: ['Aadhar Card', 'PAN Card', 'Voter ID'],
            required: false,
        },
        documentNumber: {
            type: String,
            required: false,
        }
    }],
      notifications: [
    {
      fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
      message: String,
      createdAt: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'accept', 'reject'], default: 'pending' }
    }
  ],
  connections: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { 
            _id: this._id,
            email: this.email,
            username: this.username 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    );
    return token;
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);