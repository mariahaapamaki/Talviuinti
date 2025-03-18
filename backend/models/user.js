const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    lastLogin: {
        type: String,
        default: (Date.now).toString()
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals:true,
})

const User = mongoose.model('User', userSchema);
module.exports = User;
