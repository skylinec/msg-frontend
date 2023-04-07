const express = require("express")
const Track = require("./models/Track") // new
const Similarity = require("./models/Similarity")
const Settings = require("./models/Settings")

const router = express.Router()
const WebSocketServer = require("ws");
// const {PythonShell} =require('python-shell');
// const mongoose = require("mongoose")

const wss = new WebSocketServer.Server({ port: 9000 })

var lock = false

// let options = {
//     // mode: 'text',
//     pythonPath: '/Users/matt/opt/anaconda3/envs/native/bin/python',
//     scriptPath: '../../msg-backend/',
//     // pythonOptions: ['-u'], // get print results in real-time
// };

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

// Get all tracks
router.get("/tracks", async (req, res) => {
	const tracks = await Track.find()
	res.send(tracks)
})

// Get all similarities
router.get("/similarities", async (req, res) => {
	const similarities = await Similarity.find()
	res.send(similarities)
})

// Get all settings
router.get("/settings", async (req, res) => {
	const settings = await Settings.find()
	res.send(settings)
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

    console.log("[TRACK] Posting track... " + track);

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

    console.log("[SIMILARITY] Posting similarity... " + similarity);

    await similarity.save();
    
    res.send(similarity);
})

router.post("/settings", async (req, res) => {
    // console.log("Req", req)
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    console.log("[SETTINGS] Deleting old settings...")
    await Settings.deleteMany({})

    const settings = new Settings({
        centroidSim: req.body.centroidSim,
        contrastSim: req.body.contrastSim,
        bandwidthSim: req.body.bandwidthSim,
        rolloffSim: req.body.rolloffSim,
        rmseSim: req.body.rmseSim,
        zcrSim: req.body.zcrSim,
        mfccSim: req.body.mfccSim,
        chromaStftSim: req.body.chromaStftSim
    })

    console.log("[SETTINGS] Posting settings... " + settings);

    await settings.save();
    
    res.send(settings);

    wss.clients.forEach(function each(client) {
        client.send("SETTINGS")
    });
})

router.post("/da", async(req, res) => {
    console.log("CHANGE RECEIVED")

    wss.clients.forEach(function each(client) {
        client.send("CHANGE")
    });

    res.send("Done!");
})

router.post("/lock", async(req, res) => {
    console.log("CHANGING LOCK")

    wss.clients.forEach(function each(client) {
        client.send("LOCK")
    });
    lock = true;

    res.send("Done!");
})

router.get("/check_lock", async(req, res) => {
    console.log("CHANGING LOCK")

    if(lock === true){
        res.send({
            "val": "LOCKED"
        })
    }else if (lock === false){
        res.send({
            "val": "UNLOCKED"
        })
    }

    // res.send("Done!");
})

router.post("/send_status_text", async(req, res) => {
    // console.log("SENDING STATUS", req.body.statusText)

    wss.clients.forEach(function each(client) {
        client.send(req.body.statusText)
    });

    res.send("Done!");
})

router.post("/unlock", async(req, res) => {
    console.log("CHANGING LOCK")

    wss.clients.forEach(function each(client) {
        client.send("LOCK OFF")
    });
    lock = false;
    
    res.send("Done!");
})

router.post("/restart_backend", async(req, res) => {
    // ogShell.kill()
})

router.post("/clear_tracks", async (req, res) => {
    console.log("[TRACK] CLEARING DATABASE")

    await Track.deleteMany({})

    console.log("[TRACK] DATABASE CLEARED")

    res.send({
        "message": "Cleared successfully"
    })
})

router.post("/clear_similarities", async (req, res) => {
    console.log("[SIMILARITY] CLEARING DATABASE")

    await Similarity.deleteMany({})

    console.log("[SIMILARITY] DATABASE CLEARED")

    res.send({
        "message": "Cleared successfully"
    })
})

module.exports = router