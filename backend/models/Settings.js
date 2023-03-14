const { Number, Schema } = require("mongodb")
const mongoose = require("mongoose")

const schema = mongoose.Schema({
    centroidSim: mongoose.Schema.Types.Number,
    contrastSim: mongoose.Schema.Types.Number,
    bandwidthSim: mongoose.Schema.Types.Number,
    rolloffSim: mongoose.Schema.Types.Number,
    rmseSim: mongoose.Schema.Types.Number,
    zcrSim: mongoose.Schema.Types.Number,
    mfccSim: mongoose.Schema.Types.Number,
    chromaStftSim: mongoose.Schema.Types.Number
})

module.exports = mongoose.model("Settings", schema)