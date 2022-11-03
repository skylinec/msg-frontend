const express = require("express")
const Track = require("./models/Track") // new
const router = express.Router()

// Get all posts
router.get("/tracks", async (req, res) => {
	const tracks = await Track.find()
	res.send(tracks)
})

router.post("/tracks", async (req, res) => {
    const track = new Track({
        fileName: req.body.fileName,
        centroid: req.body.centroid,
        bandwidth: req.body.bandwidth,
        contrast: req.body.contrast,
        tempo: req.body.tempo
    })

    console.log("Posting... " + track);

    await track.save();
    res.send(track);
})

module.exports = router