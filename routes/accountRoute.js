const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

router.get("/login", utilities.clearCookie, utilities.handleErrors(invController.buildLogin));

router.get("/register", utilities.handleErrors(invController.buildRegister));

// Process the register attempt
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
  utilities.handleErrors(invController.accountLogin)
)

//Account management route
router.get("/management",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildAccountManagement)
);

//Account Update View
router.get("/update/:account_id", utilities.handleErrors(invController.buildAccountUpdate));


router.post("/update/:account_id", (req, res, next) => {
  const action = req.body.action;

  let middlewareStack;

  if (action === "updateInfo") {
    middlewareStack = [
      ...regValidate.updateRules(),
      regValidate.checkRegUpdateData,
      utilities.handleErrors(invController.accountUpdate),
    ];
  } else if (action === "updatePassword") {
    middlewareStack = [
      ...regValidate.updatePwordRules(), // com parênteses!
      regValidate.checkRegUpdatePword,
      utilities.handleErrors(invController.updatePassword),
    ];
  } else {
    return next(new Error("Ação inválida."));
  }

  // Executar a pilha manualmente
  executeMiddlewareStack(middlewareStack, req, res, next);
});

function executeMiddlewareStack(stack, req, res, next) {
  let index = 0;
  function runNext(err) {
    if (err) return next(err);
    const middleware = stack[index++];
    if (!middleware) return;
    middleware(req, res, runNext);
  }
  runNext();
}




module.exports = router;