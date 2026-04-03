const express = require("express");
const router = express.Router();

//index posts
router.get("/", (req, res)=>{
    res.send("GET for posts")
})
//show posts
router.get("/:id", (req, res)=>{
    res.send("Get for post id")
})
//POST-users
router.post("/", (req, res)=>{
    res.send("Post for posts");
})
//delete-users
router.delete("/:id", (req, res)=>{
    res.send("DELETE for post Id")
})
module.exports = router;