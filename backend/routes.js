const express = require("express")
const Track = require("./models/Track") // new
const router = express.Router()
const WebSocketServer = require("ws");
const mongoose = require("mongoose")

const wss = new WebSocketServer.Server({ port: 9000 })

const conn = mongoose.connect("mongodb://localhost:27017/msg", { useNewUrlParser: true });

// Creating connection using websocket
wss.on("connection", ws => {
	console.log("new client connected");
	// sending message
	ws.on("message", data => {
		console.log(`Client has sent us: ${data}`)
	});
	// handling what to do when clients disconnects from server
	ws.on("close", () => {
		console.log("the client has connected");
	});
	// handling client connection error
	ws.onerror = function () {
		console.log("Some Error occurred")
	}
});
console.log("The WebSocket server is running on port 8080");

// Get all posts
router.get("/tracks", async (req, res) => {
	const tracks = await Track.find()
	res.send(tracks)
})

router.post("/check_if_exists", async (req, res) => {
    Track.exists({fileName:req.body.fileName}, function (err, doc) {
        if (err){
            res.send({})
        }else{
            console.log("Result :", doc) // true
            res.send(doc)
            console.log("doc",doc)
        }
    });
})

router.post("/remove", async (req, res) => {
    console.log("Removing",req.body.fileName)

    Track.find({fileName:req.body.fileName}).remove(function (err, doc) {
        console.log("Removing..", doc)
    })
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

router.post("/da", async(req, res) => {
    console.log("ANALYSIS DONE RECEIVED")

    wss.clients.forEach(function each(client) {
        client.send("CHANGE")
    });

    res.send("Done!");
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