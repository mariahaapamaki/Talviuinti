const mongoose = require('mongoose')

const publicPlaceSchema = mongoose.Schema({
   latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
   date: {
        type: String,
        default: (Date.now).toString()
    },
    isPublic: {
        type: Boolean,
        required: true,
    },
    publicInfo: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    comment: {
            type: String,
            required: false
        }
})

publicPlaceSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

publicPlaceSchema.set('toJSON', {
    virtuals:true,
})

const PublicPlace = mongoose.model('PublicPlace', publicPlaceSchema);
module.exports = PublicPlace;

exports.PublicPlace = mongoose.model('PublicPlace', publicPlaceSchema);
exports.publicPlaceSchema = publicPlaceSchema;