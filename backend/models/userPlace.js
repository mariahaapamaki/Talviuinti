const mongoose = require('mongoose')

const userPlaceSchema = mongoose.Schema({
   latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
   date: {
        type: String,
        default: (Date.now).toString()
    },
})

userPlaceSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

userPlaceSchema.set('toJSON', {
    virtuals:true,
})

const UserPlace = mongoose.model('UserPlace', userPlaceSchema);
module.exports = UserPlace;

exports.UserPlace = mongoose.model('UserPlace', userPlaceSchema);
exports.userPlaceSchema = userPlaceSchema;
