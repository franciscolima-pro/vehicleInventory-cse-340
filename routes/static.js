const express = require('express');
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public")); //Indicates that the Express router will serve static files from the "public" directory
router.use("/css", express.static(__dirname + "public/css"));// Indicates that any route that contains /css is to refer to the public/css folder.
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));
//This is VERY IMPORTANT. If a resource is NOT exported, it cannot be used somewhere else.
module.exports = router;