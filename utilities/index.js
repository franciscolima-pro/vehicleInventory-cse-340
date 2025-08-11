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
Util.buildClassificationGrid = async function(data, account_id = null){
  let grid = ""
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    for (const vehicle of data) { 
      let isFavorite = false;
      if (account_id) {
        try {
          isFavorite = await invModel.getFavorite(account_id, vehicle.inv_id);
          console.log('Favorite: ', isFavorite)
        } catch (error) {
          console.error("Error checking favorite:", error);
        }
      }
      grid += '<li>'
      grid +=  '<div style="position:relative"><a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      if(account_id){ grid +=  `<form class="favorite-form" method="POST" action="/inv/type/${vehicle.classification_id}" style="position:absolute; top:0">
      <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
      <button type="submit" class="favorite-btn ${isFavorite ? 'favorited' : ''}" style="background:none; border:none"> 
      <?xml version="1.0"?><svg height="58px" version="1.1" viewBox="0 0 58 58" width="30px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><defs/><g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1"><g id="020---Star" transform="translate(-1.000000, 0.000000)"><path d="M31.7569,1.14435 L39.2006,16.94809 C39.4742047,17.5450605 40.0274966,17.9662669 40.67576,18.07109 L57.32037,20.60534 C58.0728338,20.7512497 58.6840769,21.2991656 58.9110909,22.0312558 C59.1381048,22.7633461 58.9440977,23.560962 58.4062,24.107 L46.36205,36.40845 C45.8969861,36.8906851 45.6879532,37.5647752 45.79858,38.22553 L48.64182,55.59553 C48.7969313,56.3422303 48.5093863,57.1116407 47.9025754,57.5735945 C47.2957646,58.0355484 46.4775729,58.1079148 45.7991,57.75964 L30.9117,49.55864 C30.3445605,49.2442297 29.6554395,49.2442297 29.0883,49.55864 L14.2009,57.75964 C13.5224271,58.1079148 12.7042354,58.0355484 12.0974246,57.5735945 C11.4906137,57.1116407 11.2030687,56.3422303 11.35818,55.59553 L14.20142,38.22553 C14.3120468,37.5647752 14.1030139,36.8906851 13.63795,36.40845 L1.5938,24.107 C1.05593046,23.5609597 0.861941478,22.7633618 1.08895299,22.0312898 C1.31596449,21.2992177 1.92718692,20.7513115 2.67963,20.60539 L19.32424,18.0711 C19.9725034,17.9662769 20.5257953,17.5450705 20.7994,16.9481 L28.2431,1.14435 C28.5505421,0.448721422 29.2394609,-5.16717968e-06 30,-5.16717968e-06 C30.7605391,-5.16717968e-06 31.4494579,0.448721422 31.7569,1.14435 Z" fill="#2d2d2cff" class="Shape"/><path d="M18.14844,38.87158 C18.4633166,36.9540814 17.8494148,35.0009438 16.49414,33.6084 L7.07031,23.98291 L19.92676,22.02591 C21.8914891,21.7210725 23.5752482,20.4575107 24.417,18.65625 L30,6.80225 L35.581,18.65283 C36.4226712,20.4555677 38.1072282,21.720432 40.07319,22.02583 L52.92964,23.98283 L43.50386,33.61027 C42.1493392,35.0034307 41.5362139,36.9566633 41.85156,38.874 L44.03613,52.22166 L32.8418,46.05518 C31.0734665,45.0789497 28.9278569,45.0785721 27.15918,46.05418 L15.96387,52.22168 L18.14844,38.87158 Z" fill="${isFavorite ? '#ffd000ff' : '#CCCCCC'}" class="Shape2"/></g></g></svg> </button> </form>`}
      grid += '</div>'
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
    }
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildFavoritesGrid = async function(data){
  let grid = ""
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    for (const vehicle of data) { 
      grid += '<li>'
      grid +=  '<div style="position:relative"><a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '</div>'
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
    }
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