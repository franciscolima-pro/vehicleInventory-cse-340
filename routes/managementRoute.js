const express =  require("express");
const router = express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");

router.get("/management",
    utilities.checkAdminAccess,
    utilities.handleErrors(invController.buildManagement)
);

module.exports = router;

