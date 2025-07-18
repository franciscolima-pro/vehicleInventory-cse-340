// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId); //links geralmetes enviam requisiçoes via GET, por isso no link dessa rota usa-se get.

module.exports = router;