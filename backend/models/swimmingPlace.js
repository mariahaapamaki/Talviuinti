const mongoose = require('mongoose')

const swimmingPlaceSchema = mongoose.Schema({
    latitude: Number,
    longitude: Number,
    userAdded: Number,
    dateAdded: String
})

exports.swimmingPlace = mongoose.model('SwimmingPlace', swimmingPlaceSchema)