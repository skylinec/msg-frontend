const { Number, Schema } = require("mongodb")
const mongoose = require("mongoose")

const schema = mongoose.Schema({
    id: String,
	source: String,
    target: String,
    label: String,
    colour: String,
    rank: mongoose.Schema.Types.Number,
})

module.exports = mongoose.model("Similarity", schema)