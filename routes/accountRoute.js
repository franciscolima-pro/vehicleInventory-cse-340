const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

router.get("/login", utilities.handleErrors(invController.buildLogin));

router.get("/register", utilities.handleErrors(invController.buildRegister));

router.post("/register", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(invController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkRegDataLogin,
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;