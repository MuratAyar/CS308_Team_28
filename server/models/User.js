const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        unique : true,
        minlength: [3, 'Password must be at least 6 characters long'],
    },
    role : {
        type : String,
        default : 'user'
    }
});

const User = mongoose.model('User', UserSchema)
module.exports = User;