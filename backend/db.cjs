/** @format */

const pgPromise = require("pg-promise")({
	error(error, event) {
		console.error(error);

		if (event.query) {
			let errorContext = `Error with query: "${event.query}"`;
			if (event.params) {
				errorContext += `, using parameters (${event.params})`;
			}
			console.warn(errorContext);
		}
	},
});

// Uses variables from .env for connection
const connection = pgPromise({
	connectionString: process.env.PG_CONNECTION_STRING,
	ssl: {
		require: true,
	},
});

module.exports = {
	connection,
	pgPromise,
};
