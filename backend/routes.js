const express = require("express")
const Track = require("./models/Track") // new
const Similarity = require("./models/Similarity")
const router = express.Router()
const WebSocketServer = require("ws");
const {PythonShell} =require('python-shell');
// const mongoose = require("mongoose")

const wss = new WebSocketServer.Server({ port: 9000 })

let options = {
    // mode: 'text',
    pythonPath: '/Users/matt/opt/anaconda3/envs/native/bin/python',
    scriptPath: '../../msg-backend/',
    // pythonOptions: ['-u'], // get print results in real-time
};

// let ogShell = new PythonShell('backend.py', options)

// ogShell.on("message", function (message) {
//     console.log(message);
//   });

// const conn = mongoose.connect("mongodb://localhost:27017/msg", { useNewUrlParser: true });

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

router.get("/get_tracks_count", async (req, res) => {
	const tracks = await Track.find()
    let track_count = Object.keys(tracks).length;
	res.send({
        "track_count": track_count
    })
})

router.post("/check_if_exists", async (req, res) => {
    Track.exists({fileName:req.body.fileName}, function (err, doc) {
        if (err){
            res.send(err)
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

        res.send(doc)
    })
})

router.post("/tracks", async (req, res) => {
    // console.log("Req", req)

    const track = new Track({
        fileName: req.body.fileName,
        genre: req.body.genre,
        key: req.body.key,
        centroid: req.body.centroid,
        rmse: req.body.rmse,
        bandwidth: req.body.bandwidth,
        rolloff: req.body.rolloff,
        contrast: req.body.contrast,
        tempo: req.body.tempo
    })

    console.log("[TRACKS] Posting track... " + track);

    await track.save();
    
    res.send(track);
})

router.post("/similarities", async (req, res) => {
    // console.log("Req", req)

    const similarity = new Similarity({
        id: req.body.id,
	    source: req.body.source,
        target: req.body.target,
        label: req.body.label,
        colour: req.body.colour,
        rank: req.body.rank,
    })

    console.log("[SIMILARITIES] Posting similarity... " + similarity);

    await similarity.save();
    
    res.send(similarity);
})

router.post("/da", async(req, res) => {
    console.log("ANALYSIS DONE RECEIVED")

    wss.clients.forEach(function each(client) {
        client.send("CHANGE")
    });

    res.send("Done!");
})

router.post("/restart_backend", async(req, res) => {
    // ogShell.kill()
})

router.post("/clear_tracks", async (req, res) => {
    console.log("[TRACKS] CLEARING DATABASE")

    await Track.deleteMany({})

    console.log("[TRACKS] DATABASE CLEARED")

    res.send({
        "message": "Cleared successfully"
    })
})

router.post("/clear_similarities", async (req, res) => {
    console.log("[SIMILARITIES] CLEARING DATABASE")

    await Similarity.deleteMany({})

    console.log("[SIMILARITIES] DATABASE CLEARED")

    res.send({
        "message": "Cleared successfully"
    })
})

module.exports = router