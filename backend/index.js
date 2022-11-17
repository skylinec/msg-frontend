const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes") // new

// const http = require('http');
// const server = http.createServer(express);
// const { Server } = require("socket.io");
// const io = new Server(server);

mongoose.connect("mongodb://localhost:27017/msg", { useNewUrlParser: true })
	.then(() => {
		const app = express()

        app.use(express.json())
        // app.use(cors);

		app.use("/api", routes) // new

		app.listen(6001, () => {
			console.log("Server has started!")
		})
	})

// const client = mongoose.connection.client;
// const db = client.db('msg');
// const collection = db.collection('tracks');
// const changeStream = collection.watch();
// changeStream.on('change', data => {
// 	wss.clients.forEach(function each(client) {
// 		if (client.readyState === WebSocket.OPEN) {
// 			client.send(data);
// 		}
// 	});
// })

