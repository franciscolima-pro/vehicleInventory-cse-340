const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Details view HTML
* ************************************ */
Util.buildInvGrid = async function(data){
  let gridDetail
  if(data.length > 0){
    gridDetail = '<div id="details-display">'
    gridDetail += '<div class="car-img">'
    gridDetail += '<img src="' + data[0].inv_image +'">'
    gridDetail += '</div>'
    gridDetail += '<div class="car-details">'
    gridDetail += '<span>'
    gridDetail += '<strong>' + data[0].inv_make + ' ' + data[0].inv_model + ' ' + 'Details' + '</strong>'
    gridDetail += '</span>'
    gridDetail += '<p>'
    gridDetail += '<strong>Price: $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</strong>'
    gridDetail += '</p>'
    gridDetail += '<p>'
    gridDetail += '<strong>Description:</strong> ' + data[0].inv_description
    gridDetail += '</p>'
    gridDetail += '<p>'
    gridDetail += '<strong>Color: </strong>' + data[0].inv_color
    gridDetail += '</p>'
    gridDetail += '<p>'
    gridDetail += '<strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(data[0].inv_miles)
    gridDetail += '</p>'
    gridDetail += '</div>'
    gridDetail += '</div>'
  } else { 
    gridDetail = '<p class="notice-details">Sorry, no vehicles details could be found.</p>'
  }
  return gridDetail
}

/* **************************************
* Build the classifications|list HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" title="Please select a vehicle classification from the list" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
* Middleware to check token Account Authorization
**************************************** */
 Util.checkAdminAccess = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Session expired. Please log in again.");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }

        // Verifica se é Employee ou Admin
        if (accountData.account_type !== 'Employee' && accountData.account_type !== 'Admin') {
          req.flash("notice", "You don't have administrative privileges.");
          return res.redirect("/account/login");
        }

        // Adiciona dados à response
        res.locals.accountData = accountData;
        res.locals.loggedin = true;
        next();
      }
    );
  } else {
    req.flash("notice", "Please log in to access this page.");
    res.redirect("/account/login");
  }
};

//clear JWT
 Util.clearCookie = (req, res, next) => {
  res.clearCookie("jwt");
  next();
 }

module.exports = Util