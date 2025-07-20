// Needed Resources 
const express = require("express");
const router = new express.Router();

// error 
router.get("/errortest", (req, res, next) => {
    const error = new Error('Error test 500!');
    error.status = 500;
    next(error)
}); 

module.exports = router;