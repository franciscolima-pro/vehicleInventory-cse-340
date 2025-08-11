const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all favorite items
 * ************************** */
async function getFavorite(account_id, inv_id) {
  try {
    const result = await pool.query(
      'SELECT 1 FROM favorites WHERE account_id = $1 AND inv_id = $2 LIMIT 1',
      [account_id, inv_id]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error in getFavorite:", error);
    return false;
  }
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
      `SELECT inv_id, inv_image, inv_thumbnail, inv_year, inv_make, inv_model, inv_price, inv_description, inv_color, inv_miles, classification_id
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

/* ***************************
 *  Update Inventory Item
 * ************************** */
async function updateInventoryItem(
  inv_id,
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
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    
    const data =  await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ]);
    return data.rows[0]
  } catch (error) {
    console.error("updateInventory error:", error);
    throw error; // Re-throw for controller handling
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data =  await pool.query(sql, [inv_id]);
    return data
  } catch (error) {
    console.error("deleteInventory error:", error);
    throw error; // Re-throw for controller handling
  }
}

/**
 * Adiciona um carro aos favoritos do usuário.
 */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao adicionar favorito: " + error.message);
  }
}

/**
 * Remove um carro dos favoritos do usuário.
 */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE account_id = $1 AND inv_id = $2
      RETURNING *;
    `;
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Erro ao remover favorito: " + error.message);
  }
}

/**
 * Obtém todos os veículos favoritos de um usuário com detalhes.
 */
async function getUserFavorites(account_id) {
  try {
    const sql = `
      SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_price, i.inv_thumbnail
      FROM favorites f
      JOIN inventory i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.created_at DESC;
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    throw new Error("Erro ao buscar favoritos: " + error.message);
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryDataByinvId, addClassification, addInventoryItem, updateInventoryItem, deleteInventoryItem, addFavorite, removeFavorite, getUserFavorites, getFavorite};