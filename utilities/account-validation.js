const utilities = require(".");
const  { body, validationResult } = require("express-validator");
const validate = {};
const pool = require('../database');
// The body tool allows the validator to access the body object, which contains all the data, sent via the HTTPRequest. The validationResult is an object that contains all errors detected by the validation process
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
            }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.loginRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to Login
 * ***************************** */
validate.checkRegDataLogin = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Add classification Validation Rules
  * ********************************* */
  validate.addClassificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty().withMessage("Classification name is required")
        .isLength({ min: 1 })
        .isAlpha().withMessage("Only alphabetic characters (A-Z, a-z) are allowed")
        .custom(async (classification_name) =>{
          const classes = await invModel.getClassifications();
          if(classes.rows.some(classe => classe.classification_name.toLowerCase() == classification_name.toLowerCase())){
            throw new Error("Classification already exists.")
          }
        })
    ]
  }

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkRegDataAddClassification = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // classification_id is required and must exist in DB
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please select a valid classification.")
      .custom(async (classification_id) => {
        const exists = await pool.query(
          'SELECT 1 FROM classification WHERE classification_id = $1', 
          [classification_id]
        );
        if (!exists.rows.length) {
          throw new Error("Invalid classification selected");
        }
      }),

    // inv_make is required and must be alphanumeric with spaces/hyphens
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2, max: 50 })
      .matches(/^[A-Za-z0-9\- ]+$/)
      .withMessage("Make must be 2-50 characters (letters, numbers, hyphens)"),

    // inv_model is required and must be alphanumeric with spaces/hyphens
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2, max: 50 })
      .matches(/^[A-Za-z0-9\- ]+$/)
      .withMessage("Model must be 2-50 characters (letters, numbers, hyphens)"),

    // inv_description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10, max: 500 })
      .withMessage("Description must be 10-500 characters"),

    // inv_image must be valid image path
    body("inv_image")
      .trim()
      .notEmpty()
      .matches(/^[\/\w\-\.]+\.(jpg|jpeg|png|webp|gif)$/i)
      .withMessage("Invalid image path (must be .jpg, .png, .webp or .gif)"),

    // inv_thumbnail must be valid image path
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .matches(/^[\/\w\-\.]+\.(jpg|jpeg|png|webp|gif)$/i)
      .withMessage("Invalid thumbnail path (must be .jpg, .png, .webp or .gif)"),

    // inv_price must be positive number
    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0.01 })
      .withMessage("Price must be a positive number"),

    // inv_year must be valid year
    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}`),

    // inv_miles must be positive integer
    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number"),

    // inv_color must be letters and spaces only
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Color must contain only letters and spaces")
  ];
};

/* ******************************
 * Check data and return errors or continue to inventory processing
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let list = await utilities.buildClassificationList();
    const classifications = await invModel.getClassifications();
    
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      list,
      classifications,
      locals: req.body
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to Update inventory processing
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let list = await utilities.buildClassificationList();
    const classifications = await invModel.getClassifications();
    const inv_id = req.params.inv_id;
    const itemData = await invModel.getInventoryDataByinvId(inv_id);
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      list,
      inv_id,
      classifications,
      locals: req.body
    });
    return;
  }
  next();
};

/*  **********************************
  *  Update Data Validation Rules
  * ********************************* */
  validate.updateRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.getAccountByEmail(account_email)
        console.log('EMAIL; ', emailExists)
        // Permite manter o mesmo email se for do próprio usuário
        if (emailExists && emailExists.account_id != req.params.account_id) {
          throw new Error("Email already in use by another account")
        }
      }),
    ]
  }

/* ******************************
 * Check data and return errors or continue to Update process
 * ***************************** */
validate.checkRegUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Account Update",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

//Pword rules
validate.updatePwordRules = () =>{
  return [
        body("account_password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to Update process
 * ***************************** */
validate.checkRegUpdatePword = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/update", {
      errors,
      title: "Account Update",
      nav,
      account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    })
    return
  }
  next()
}

module.exports = validate