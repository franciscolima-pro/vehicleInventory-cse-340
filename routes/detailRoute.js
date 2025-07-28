const express = require("express");
const router = new express.Router();
const utilities = require("../utilities")
const invController = require("../controllers/invController");

// Route to build vehicle details by Inv view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));;

module.exports = router;