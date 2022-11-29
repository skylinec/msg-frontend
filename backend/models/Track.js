const { Number, Schema } = require("mongodb")
const mongoose = require("mongoose")

const schema = mongoose.Schema({
	fileName: String,
    genre: String,
    key: String,
    rmse: mongoose.Schema.Types.Number,
	centroid: mongoose.Schema.Types.Number,
    bandwidth: mongoose.Schema.Types.Number,
    rolloff: mongoose.Schema.Types.Number,
    contrast: mongoose.Schema.Types.Number,
    tempo: mongoose.Schema.Types.Number
})

module.exports = mongoose.model("Track", schema)