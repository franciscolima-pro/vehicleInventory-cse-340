/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
// const static = require("./routes/static")


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
app.get('/', baseController.buildHome)
// Inventory routes
app.use("/inv", inventoryRoute)
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
