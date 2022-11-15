const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes") // new
const cors = require('cors');

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