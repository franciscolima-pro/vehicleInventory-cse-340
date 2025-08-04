const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next){
    let nav = await utilities.getNav();
    res.render("account/login",{
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next){
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const tokenData = {
        ...accountData,
        account_type: accountData.account_type // Garante que o tipo de conta está no token
      }
      const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        //"httpOnly: true" - This means that the cookie can only be passed through the HTTP protocol and cannot be accessed by client-side JavaScript.
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        //httpOnly: true / "secure: true" - This means that the cookie can only be passed through HTTPS and not HTTP.
      }
      return res.redirect("/account/management")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav();
  res.render("account/accountManagement",{
    title: "Account Management",
    nav,
    errors: null,
  })
}

//Build Account Update View
async function buildAccountUpdate(req, res) {
  const accountId = req.params.account_id;
  const nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(accountId);
  res.render("account/update",{
    title: "Account Update",
    nav,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    errors: null,
  })
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function accountUpdate(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id} = req.body

  const regResult = await accountModel.accountUpdate(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, your information has been updated.`
    )
    return res.redirect("/account/management")
  } else {
    req.flash("notice", "Sorry, the update process failed.")
    return res.status(501).render(`account/update`, {
      title: "Account Update",
      nav,
      errors: null,
    })
  }
}

async function updatePassword(req, res) {
  const { account_password, account_id } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    await accountModel.updatePassword(hashedPassword, account_id);
    
    req.flash("notice", "Password updated successfully");
    res.redirect("/account/management");
  } catch (error) {
    req.flash("notice", "Error updating password");
    res.redirect(`/account/update/${account_id}`);
  }
};

module.exports = {buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildAccountUpdate, accountUpdate, updatePassword}