const express = require("express")
const Post = require("./models/Track") // new
const router = express.Router()

// Get all posts
router.get("/tracks", async (req, res) => {
	const posts = await Post.find()
	res.send(posts)
})

module.exports = router