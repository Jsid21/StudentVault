const mongoose = require("mongoose");
const schema = mongoose.Schema;

// const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures username is unique
    },
    email:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true,
      },
});

// no need to add username and password fields as PassPort is going to manage it

module.exports = mongoose.model('User', userSchema);