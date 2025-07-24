const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/accountController");

router.get("/login", utilities.handleErrors(invController.buildLogin));

router.get("/register", utilities.handleErrors(invController.buildRegister));

module.exports = router;