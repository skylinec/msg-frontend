const express = require("express")
const Track = require("./models/Track") // new
const router = express.Router()

// Get all posts
router.get("/tracks", async (req, res) => {
	const tracks = await Track.find()
	res.send(tracks)
})

router.post("/tracks", async (req, res) => {
    // console.log("Req", req)

    const track = new Track({
        fileName: req.body.fileName,
        genre: req.body.genre,
        centroid: req.body.centroid,
        rmse: req.body.rmse,
        bandwidth: req.body.bandwidth,
        rolloff: req.body.rolloff,
        contrast: req.body.contrast,
        tempo: req.body.tempo
    })

    console.log("Posting... " + track);

    await track.save();
    res.send(track);
})

router.post("/cleartracks", async (req, res) => {
    console.log("CLEARING DATABASE")

    await Track.deleteMany({})

    console.log("DATABASE CLEARED")

    res.send({
        "message": "Cleared successfully"
    })
})

module.exports = router