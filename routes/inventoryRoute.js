// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities")
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId)); //links geralmente enviam requisiçoes via GET, por isso no link dessa rota usa-se get.

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory));

router.post("/edit/:inv_id", utilities.handleErrors(invController.updateInventory))

module.exports = router;