/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/

const express = require("express");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const detailRoute = require("./routes/detailRoute");
const managementRoute = require("./routes/managementRoute");
const addClassificationRoute = require("./routes/addClassificationRoute");
const addInventoryRoute = require("./routes/addInventoryRoute");
const errorRoute = require('./routes/errorRoute');
const accountRoute = require('./routes/accountRoute');
const utilities = require("./utilities");
const session = require("express-session");
const pool = require('./database/');
const bodyParser = require("body-parser");

/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

//Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

//body parser mMiddleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates //  O Express precisa já saber que está usando o layout e o view engine antes de processar qualquer rota. Então esse bloco vem antes das Rotas.
 *************************/
app.set("view engine", "ejs"); 
app.use(expressLayouts);
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes 
 *************************/
// Static Routes
app.use(require("./routes/static"))
// Index Route
app.get('/', utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", utilities.handleErrors(inventoryRoute))
// Detail routes
app.use("/inv", utilities.handleErrors(detailRoute))
// Management routes
app.use('/inv', utilities.handleErrors(managementRoute));
// Add classification routes
app.use('/inv', utilities.handleErrors(addClassificationRoute));
// Add classification routes
app.use('/inv', utilities.handleErrors(addInventoryRoute));
// error test routes
app.use('/', utilities.handleErrors(errorRoute));
// Account routes
app.use('/account', utilities.handleErrors(accountRoute));

/* ***********************
* File Not Found Route - must be last route in list
* Place after all routes
* Unit 3, Basic Error Handling Activity
**************************/
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
   if(err.status == 404){ message = err.message}
   else if(err.status == 500){message = err.message}
   else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
