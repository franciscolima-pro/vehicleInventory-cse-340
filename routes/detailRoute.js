const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build vehicle details by Inv view
router.get("/detail/:invId", invController.buildByInvId);;

module.exports = router;