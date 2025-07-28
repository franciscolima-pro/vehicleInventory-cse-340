const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`, // The "$1" is a placeholder, which will be replaced by the value shown in the brackets "[]" when the SQL statement is run
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get inventory data by inv_id
 * ************************** */
async function getInventoryDataByinvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT inv_image, inv_year, inv_make, inv_model, inv_price, inv_description, inv_color, inv_miles 
      FROM inventory AS i WHERE i.inv_id = $1`, // The "$1" is a placeholder, which will be replaced by the value shown in the brackets "[]" when the SQL statement is run
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorydatabyinvid error " + error)
  }
}

/* ***************************
 *  Add classification
 * ************************** */
async function addClassification(classification_name){
  try{
    const classes = await getClassifications();

    const alreadyExists = classes.rows.some(
      row => row.classification_name.toLowerCase() === classification_name.toLowerCase()
    );

    if (!alreadyExists) {
      const sql = 'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';
      return await pool.query(sql, [classification_name])
    }
    
  }catch(error){
    console.error("addClassification error: " + error)
  }
}

/* ***************************
 *  Add Inventory
 * ************************** */
async function addInventoryItem(
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
) {
  try {
    const sql = `
      INSERT INTO inventory (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    return await pool.query(sql, [
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
    ]);
    
  } catch (error) {
    console.error("addInventoryItem error:", error);
    throw error; // Re-throw for controller handling
  }
}
module.exports = {getClassifications, getInventoryByClassificationId, getInventoryDataByinvId, addClassification, addInventoryItem};