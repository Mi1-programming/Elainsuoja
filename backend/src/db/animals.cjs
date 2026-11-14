/** @format */

const { PostProcessAnimals } = require("#src/data/post/animal.cjs");
const { connection } = require("#src/db.cjs");

/**
 * A category of animals received from SQL
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} image_url
 */


/**
 * 
 * @param {string} categoryTextId 
 * @returns {string}
 */
async function GetCategoryNameByTextID(categoryTextId) {
	const result = await connection.one(
		"SELECT name FROM category WHERE id = $1",
		[categoryTextId],
	);
	return result.name;
}
/**
 * 
 * @returns {Category[]}
 */
async function GetCategories() {
	const result = await connection.many(
		"SELECT name, id, description, image_url FROM category",
	);
	return result;
}

/**
 * An animal in the shelter received from SQL
 * @typedef {Object} RawAnimal
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} category_text_id
 * @property {string} breed
 * @property {string} born_date
 * @property {string} shelter_date
 * @property {string} image_url
 * @property {string} status
 */

/**
 * 
 * @param {string} categoryTextId 
 * @returns {RawAnimal[]}
 */
async function GetAnimalsByCategory(categoryTextId) {
	/** @type {RawAnimal[]} */
	const result = await connection.manyOrNone(
		`SELECT * FROM animal WHERE animal.category_text_id = $1`,
		[categoryTextId],
	);

	const processed = PostProcessAnimals(result)

	return processed;
}
/**
 * 
 * @returns {RawAnimal[]}
 */
async function GetAnimals() {
	/** @type {RawAnimal[]} */
	const result = await connection.manyOrNone("SELECT * FROM animal");

	const processed = PostProcessAnimals(result)

	return processed;
}
/**
 * 
 * @param {number} id 
 * @returns {RawAnimal}
 */
async function GetAnimalById(id) {
	/** @type {RawAnimal} */
	const result = await connection.one(`SELECT * FROM animal WHERE id = $1`, [
		id,
	]);

	const processed = PostProcessAnimals([result])[0]

	return processed;
}

module.exports = {
	GetCategoryNameByTextID,
	GetCategories,
	GetAnimalsByCategory,
	GetAnimals,
	GetAnimalById,
};
