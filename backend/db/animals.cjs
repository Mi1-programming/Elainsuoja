/** @format */

const { connection } = require("../db.cjs");

async function GetCategoryNameByTextID(category) {
	const result = await connection.one(
		"SELECT name FROM category WHERE id = $1",
		[category],
	);
	return result.name;
}
async function GetCategories() {
	const result = await connection.many(
		"SELECT name, id, description, image_url FROM category",
	);
	return result;
}
async function GetAnimalsByCategory(category) {
	const result = await connection.manyOrNone(
		`SELECT * FROM animal WHERE animal.category_text_id = $1`,
		[category],
	);
	return result;
}
async function GetAnimals() {
	const result = await connection.manyOrNone("SELECT * FROM animal");
	return result;
}
async function GetAnimalById(id) {
	const result = await connection.one(`SELECT * FROM animal WHERE id = $1`, [
		id,
	]);
	return result;
}

module.exports = {
	GetCategoryNameByTextID,
	GetCategories,
	GetAnimalsByCategory,
	GetAnimals,
	GetAnimalById,
};
