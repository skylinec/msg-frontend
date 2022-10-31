const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes") // new

mongoose
	.connect("mongodb://localhost:27017/msg", { useNewUrlParser: true })
	.then(() => {
		const app = express()
		app.use("/api", routes) // new

		app.listen(6000, () => {
			console.log("Server has started!")
		})
	})