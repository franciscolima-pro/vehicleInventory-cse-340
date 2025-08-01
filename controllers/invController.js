const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try{
    const inv_id = req.params.invId
    const data = await invModel.getInventoryDataByinvId(inv_id)
    const gridDetail = await utilities.buildInvGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
    res.render("./inventory/vehicleDetail", {
      title: className,
      nav,
      gridDetail,
      errors: null,
    })
  }catch (error) {
    console.error("CONTROLLER ERROR:", error);
    next(error);
  }
  
}

/* ***************************
 *  Build inventory Management
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList()
    // req.flash("notice", 'What do you want to do?')
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      errors: null,
    })
  } catch(error) {
    next(error);
  }
}

/* ***************************
 *  Build inventory Add classifcation
 * ************************** */
invCont.buildAddClassification = async function (req, res, next){
  try{
    const nav = await utilities.getNav();
    // req.flash("notice", '')
    res.render("inventory/add-classification",{
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }catch(error){
    next(error);
  } 
}

/* ****************************************
*  Process Register Classification
* *************************************** */
invCont.registerClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(classification_name,)

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you registered ${classification_name} classification.`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration of the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add new Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build inventory Add inventory
 * ************************** */
invCont.buildAddInventory = async function (req, res, next){
  try{
    const nav = await utilities.getNav();
    const list = await utilities.buildClassificationList()
    // req.flash("notice", '')
    res.render("inventory/add-inventory",{
      title: "Add New Inventory Item",
      nav,
      list,
      errors: null,
    })
  }catch(error){
    next(error);
  } 
}

/* ****************************************
*  Process Register inventory
* *************************************** */
invCont.registerInventoryItem = async function (req, res) {
  let nav = await utilities.getNav();
  const list = await utilities.buildClassificationList()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  // Validação básica dos campos
  if (!classification_id || !inv_make || !inv_model) {
    req.flash("notice", "Please fill in all required fields");
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      list,
      classifications: await invModel.getClassifications(),
      locals: req.body,
      errors: null,
    });
  }

  try {
    const addResult = await invModel.addInventoryItem(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      parseFloat(inv_price),
      parseInt(inv_year),
      parseInt(inv_miles),
      inv_color,
      classification_id
    );

    if (addResult) {
      req.flash(
        "notice",
        `The ${inv_year} ${inv_make} ${inv_model} was successfully added!`
      );
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        list,
        errors: null,
      });
    } else {
      throw new Error("Inventory addition failed");
    }
  } catch (error) {
    console.error("addInventoryItem error:", error);
    req.flash("notice", "Sorry, there was an error adding the inventory item.");
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      list,
      classifications: await invModel.getClassifications(),
      locals: req.body,
      errors: null
    });
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryDataByinvId(inv_id);
  const list = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    list,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

  module.exports = invCont