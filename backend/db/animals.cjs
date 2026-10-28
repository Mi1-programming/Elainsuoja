/** @format */

const { connection } = require("../db.cjs");

async function GetNameByEndPoint(endpoint) {
	const result = await connection.one(
		"SELECT name FROM animaltype WHERE endpoint = $1",
		[endpoint],
	);
	return result;
}
async function GetEndpoints() {
	const result = await connection.many(
		"SELECT name, endpoint, description, image_url FROM animaltype WHERE endpoint IS NOT NULL",
	);
	return result;
}
async function GetAnimalsAtEndpoint(endpoint) {
	const result = await connection.manyOrNone(
		`SELECT animal.id, animal.name, animal.description, animal.type_id, animal.breed, animal.shelter_date, animal.image_url, animaltype.name AS type_name FROM
        animal INNER JOIN animaltype ON animal.type_id = animaltype.id WHERE animaltype.endpoint = $1`,
		[endpoint],
	);
	return result;
}
async function GetAnimalById(id) {
	const result = await connection.one(`SELECT * FROM animal WHERE id = $1`, [
		id,
	]);
	return result;
}

module.exports = {
	GetNameByEndPoint,
	GetEndpoints,
	GetAnimalsAtEndpoint,
	GetAnimalById,
};
