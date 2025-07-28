const express =  require("express");
const router = express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const regValidate = require("../utilities/account-validation")

router.get("/add-classification", 
    utilities.handleErrors(invController.buildAddClassification)
);
router.post("/add-classification", 
    regValidate.addClassificationRules(),
    regValidate.checkRegDataAddClassification,
    utilities.handleErrors(invController.registerClassification)
);

module.exports = router;