const express =  require("express");
const router = express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const regValidate = require("../utilities/account-validation")

router.get("/add-inventory", 
    utilities.checkAdminAccess,
    utilities.handleErrors(invController.buildAddInventory)
);
router.post("/add-inventory", 
    utilities.checkAdminAccess,
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.registerInventoryItem)
);

module.exports = router;