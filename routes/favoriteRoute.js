const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const invController = require("../controllers/invController");
const regValidate = require('../utilities/account-validation');

/** 
 * Rota para exibir todos os favoritos do usuário 
 * GET /favorites
*/
router.get("/favorites", utilities.checkJWTToken, invController.showFavorites);

/**
 * Rota para adicionar um favorito
 * POST /favorites/add
 */
router.post("/type/:classification_id", utilities.checkJWTToken, invController.addFavorite);

/**
 * Rota para remover um favorito
 * POST /favorites/remove
 */
// router.post("/type/:inv_id", invController.removeFavorite);

module.exports = router;