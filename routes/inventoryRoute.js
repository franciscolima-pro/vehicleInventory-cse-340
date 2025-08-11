// Needed Resources 
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities")
const invController = require("../controllers/invController");
const regValidate = require('../utilities/account-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.checkJWTToken, utilities.handleErrors(invController.buildByClassificationId)); //links geralmente enviam requisiçoes via GET, por isso no link dessa rota usa-se get.

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inv_id", utilities.checkAdminAccess, utilities.handleErrors(invController.buildEditInventory));

router.post("/edit/:inv_id",
    regValidate.inventoryRules(),
    utilities.checkAdminAccess,
    utilities.handleErrors(regValidate.checkUpdateData),
    utilities.handleErrors(invController.updateInventory)
)

router.get("/delete/:inv_id", utilities.checkAdminAccess, utilities.handleErrors(invController.buildDeleteInventory));

router.post("/delete/:inv_id", utilities.checkAdminAccess, utilities.handleErrors(invController.deleteInventory));

module.exports = router;